import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "../s3/download";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { getEmbeddings } from "../embeddings";
import { convertToAscii, truncateStringByBytes } from "@/lib/utils";
import { FILE_DOWNLOAD_ERROR } from "@/lib/system-messages";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(file_key: string) {
  try {
    console.log("downloading file from s3 into file system...");

    const file_name = await downloadFromS3(file_key);
    if (!file_name) {
      throw new Error(FILE_DOWNLOAD_ERROR);
    }
    console.log("loading pdf into memory" + file_name);
    // 1. Convert pdf into text streams
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. upload to pinecone
    const client = getPineconeClient();
    const pineconeIndex = client.index("clients");

    const namespace = pineconeIndex.namespace(convertToAscii(file_key));

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
  try {
    const client = getPineconeClient();
    const pineconeIndex = client.index("clients");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

async function prepareDocument(page: any) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}
