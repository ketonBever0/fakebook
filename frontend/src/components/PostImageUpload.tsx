import React, { useContext } from 'react';
import { FileContext } from '../context/FileContext';

interface PostImageUploadProps {
    onImageUploaded: (imageUrl: string) => void;
}

const PostImageUpload: React.FC<PostImageUploadProps> = ({ onImageUploaded }) => {
    const {
        inputFiles,
        setInputFiles,
    } = useContext(FileContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setInputFiles(e.target.files);
            // Create a preview URL for the selected image
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            onImageUploaded(imageUrl);
        }
    };

    return (
        <div className="post-image-upload">
            <input
                className="form-control"
                type="file"
                id="postImage"
                name="image"
                onChange={handleChange}
                accept="image/png, image/jpeg, image/gif"
            />
        </div>
    );
};

export default PostImageUpload; 