import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import ReactPlayer from "react-player";
import {FiUploadCloud} from "react-icons/fi";

const Upload = ({name, label, register, setValue, errors, video=false, viewData=null, editData=null}) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    )

    const inputRef = useRef(null)

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            setPreviewSource(reader.result);
        }
    }

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        if(file){
            previewFile(file)
            setSelectedFile(file)
        }
    }

    const { getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: !video
        ? {"image/*":[".jpeg", ".jpg", ".png"]}
        : {"video/*": [".mp4"]},
        onDrop,
    })

    useEffect(()=>{
        register(name, {required:true})
    },[register, name])

    useEffect(()=>{
        setValue(name, selectedFile)
    },[selectedFile, setValue, name]);

  return (
    <div className="flex flex-col space-y-2">
        <label htmlFor={name} className="text-sm text-gray-50">
            {label} {!viewData && <sup className=' text-pink-500'>*</sup>}
        </label>
        <div
        className={`${
          isDragActive ? "bg-gray-600" : "bg-gray-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-gray-500`}
        >
            {
                previewSource ? (
                    <div className="flex w-full flex-col p-6">
                        {
                            !video ? (
                                <img
                                    src={previewSource}
                                    alt='Preview'
                                    className="h-full w-full rounded-md object-cover"
                                />
                            )
                            : (
                                <ReactPlayer
                                    playsInline
                                    src={previewSource}
                                />
                            )
                        }
                        {
                            !viewData && (
                                <button
                                type='button'
                                onClick={()=>{
                                    setPreviewSource("")
                                    setSelectedFile(null)
                                    setValue(name, null)
                                }}
                                className="mt-3 text-gray-400 underline"
                                >
                                    Cancel
                                </button>
                            )
                        }
                    </div>
                )
                : (
                    <label htmlFor='video'>
                        <div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
                            <input {...getInputProps()} ref={inputRef} id='video' />

                            <div className="grid aspect-square w-14 place-items-center rounded-full bg-gray-900">
                                <FiUploadCloud className="text-2xl text-yellow-400"/>
                            </div>

                            <p className="mt-2 max-w-[200px] text-center text-sm text-gray-500">
                                Drag and drop an {!video ? "image" : "video" }, or click to {" "}
                                <span className="font-semibold text-yellow-400">Browse</span>
                                a file
                            </p>

                            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-gray-500">
                                <li>Aspect Ratio 16:9</li>
                                <li>Recommended size 1024x578</li>
                            </ul>
                        </div>
                    </label>
                )
            }
        </div>
        {
            errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-500">
                    {label} is required
                </span>
            )
        }
    </div>
  )
}

export default Upload