import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box } from "@material-ui/core";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    position: "absolute",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    position: "absolute",
    color: "red",
    fontSize: 22,
    right: 0,
  },
}));

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  position: "relative",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export function ImageDropZone({ setFieldValue, disabled }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFieldValue("images", acceptedFiles);
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    // if (acceptedFiles?.length) {

    //   // setFiles((previousFiles) => [
    //   //   ...previousFiles,
    //   //   ...acceptedFiles.map((file) =>
    //   //     Object.assign(file, { preview: URL.createObjectURL(file) })
    //   //   ),
    //   // ]);
    // }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    // onDrop: (acceptedFiles) => {
    //   setFieldValue("images", acceptedFiles);
    //   setFiles(
    //     acceptedFiles.map((file) =>
    //       Object.assign(file, {
    //         preview: URL.createObjectURL(file),
    //       })
    //     )
    //   );
    // },
    disabled,
  });

  const removeImage = (index) => {
    const updatedImages = [...files];
    updatedImages.splice(index, 1);
    setFiles(updatedImages);
  };

  const thumbs = files.map((file, index) => {
    return (
      <>
        <Box component="span" m={1} key={file.name}>
          <div style={thumb} key={file.name}>
            <div style={thumbInner}>
              <img
                src={URL.createObjectURL(file)}
                style={img}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
              {/* <Fab
            size="small"
            color="secondary"
            aria-label="add"
            className={classes.margin}
          > */}
              <ClearIcon
                className={classes.extendedIcon}
                onClick={() => removeImage(index)}
              />
              {/* </Fab> */}
            </div>
          </div>
        </Box>
      </>
    );
  });

  // useEffect(() => {
  //   // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
  //   return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  // }, [files]);

  return (
    <section className="container image-box">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <SystemUpdateAltIcon />
        <p>
          Drag 'n' drop some images here,<br></br> or click to select files
        </p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}
