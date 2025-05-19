import React, { createContext, useState } from 'react';

interface FileContextType {
    inputFiles: FileList | null;
    setInputFiles: (files: FileList | null) => void;
    files: File[];
    uploadFile: (files: FileList) => Promise<void>;
}

export const FileContext = createContext<FileContextType>({
    inputFiles: null,
    setInputFiles: () => {},
    files: [],
    uploadFile: async () => {},
});

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputFiles, setInputFiles] = useState<FileList | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    const uploadFile = async (files: FileList) => {
        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const uploadedFiles = await response.json();
            setFiles((prev) => [...prev, ...uploadedFiles]);
            setInputFiles(null);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    };

    return (
        <FileContext.Provider
            value={{
                inputFiles,
                setInputFiles,
                files,
                uploadFile,
            }}
        >
            {children}
        </FileContext.Provider>
    );
}; 