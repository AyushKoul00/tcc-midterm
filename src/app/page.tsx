"use client";
import "dotenv/config";
import React, { useState } from "react";
import AWS, { S3 } from "aws-sdk";

if (
  process.env.MY_ACCESS_KEY_ID === undefined ||
  process.env.MY_SECRET_ACCESS_KEY === undefined
) {
  console.error(
    "Missing environment variables. Please provide ACCESS_KEY_ID, SECRET_ACCESS_KEY in the .env file."
  );
  process.exit?.(1);
}

// console.log(process.env.MY_ACCESS_KEY_ID, process.env.MY_SECRET_ACCESS_KEY);

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.MY_ACCESS_KEY_ID!,
  secretAccessKey: process.env.MY_SECRET_ACCESS_KEY!,
  region: "us-west-1",
});

const s3: S3 = new S3();

// console.log(s3.config.credentials, s3.config.credentials?.secretAccessKey);

interface File {
  name: string;
}

interface UploadStatus {
  progress: number;
  message: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    progress: 0,
    message: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFileToS3 = async () => {
    if (!file) {
      setUploadStatus({
        progress: 0,
        message: "Please select a file to upload.",
      });
      return;
    }

    const params: S3.PutObjectRequest = {
      Bucket: "cs218midtermbucket",
      Key: file.name,
      Body: file,
      ACL: "public-read",
    };

    try {
      const data = await s3.putObject(params).promise();
      setUploadStatus({
        progress: 100,
        message: `File uploaded successfully.`,
      });
    } catch (error) {
      setUploadStatus({
        progress: 0,
        message: `Error uploading file: ${(error as Error).message}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">File Upload to S3</h1>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="bg-gray-100 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={uploadFileToS3}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload to S3
      </button>
      <div className="mt-4">
        <p>Upload Progress: {uploadStatus.progress}%</p>
        <p>{uploadStatus.message}</p>
      </div>
    </div>
  );
};

export default FileUploader;
