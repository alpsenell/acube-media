import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button.tsx";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}

const FileUploader = ({ fieldChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState('')

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      fieldChange(acceptedFiles)
      setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const {
    getRootProps, getInputProps, isDragActive
  } = useDropzone({
    onDrop,
    maxSize: 5000000,
    accept: {
      'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'],
    }
  })

  return (
    <div
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      {...getRootProps()}
    >
      <input
        className="cursor-pointer"
        {...getInputProps()}
      />
      {
        fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img
                src={fileUrl}
                alt="uploaded image"
                className="file_uploader-img"
              />
            </div>

            <p className="file_uploader-label">
              Click or drag to replace
            </p>
          </>
        ) : (
          <div className="file_uploader-box">
            <img
              src="/assets/images/file-upload.svg"
              alt="file-upload"
              width={64}
              height={64}
            />
            <h3 className="text-light-2 mb-2 mt-6">
              {isDragActive ? 'Drag and drop your photo here': 'Upload an image'}
            </h3>
            <p className="text-light-4 text-sm mb-6">
              SVG, PNG, JPG, WEBP up to 10MB
            </p>

            <Button className="shad-button_dark_4">
              Select from computer
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default FileUploader;
