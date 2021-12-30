import {
  Avatar,
  Badge,
  Button,
  ButtonBase,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { Alert } from '@mui/lab';
import numeral from 'numeral';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { makeStyles } from '@mui/styles';

export interface AvatarUploaderProps {
  src?: string
  alt?: string
  maxSizeBytes?: number
  onUpload: (dataURL: string) => void
}

export interface CropperProps {
  src: string
  onComplete: (dataURL: string) => void
  open?: boolean
  onCancel?: () => void
}

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    avatar: {
      width: '200px',
      height: '200px',
    },
    avatarMedium: {
      width: '100px',
      height: '100px',
    },
    fileInput: {
      display: 'none',
    },
    alert: {
      marginTop: theme.spacing(2),
    },
    hiddenCanvas: {
      display: 'none',
    },
    wrapper: {
      position: 'relative',
    },
    btnProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  };
});

const Cropper = ({
  src, open = false, onComplete, onCancel = () => {
  },
}: CropperProps) => {
  const classes = useStyles();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentCrop, setCurrentCrop] = useState<Crop>({ unit: '%', x: 35, y: 35, width: 30, height: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const canvasToPreview = async () => {
    const url = canvasRef?.current?.toDataURL();
    if (!url) {
      return;
    }
    setPreview(url);
  };

  useEffect(() => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      return;
    }
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width! * pixelRatio;
    canvas.height = crop.height! * pixelRatio;
    ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx!.imageSmoothingQuality = 'high';

    ctx?.drawImage(
      image,
      crop.x! * scaleY,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!,
    );
    canvasToPreview();
  }, [completedCrop]);

  const onUploadBtnClick = async () => {
    setUploading(true);
    try {
      await onComplete(preview);
    } finally {
      setUploading(false);
    }
  };

  const onDialogClose = () => {
    if (uploading) {
      return;
    }
    onCancel();
  };

  return (
    <Dialog open={open} onClose={onDialogClose} maxWidth="md">
      <DialogTitle>上传头像</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs sm={8}>
            <Typography variant="subtitle2" gutterBottom>裁剪</Typography>
            <ReactCrop
              src={src}
              onImageLoaded={onLoad}
              imageStyle={{ width: '100%' }}
              crop={currentCrop}
              onChange={(c) => setCurrentCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              circularCrop
              keepSelection
            />
          </Grid>
          <Grid item xs sm={4}>
            <Container>
              <Typography variant="subtitle2" gutterBottom>预览</Typography>
              <Avatar className={classes.avatar} src={preview} />
              <Avatar className={classes.avatarMedium} src={preview} />
              <Avatar src={preview} />
            </Container>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()} disabled={uploading}>取消</Button>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            onClick={onUploadBtnClick}
            disabled={uploading}
          >
            {uploading ? '正在上传' : '上传头像'}
          </Button>
          {uploading && <CircularProgress size={24} className={classes.btnProgress} />}
        </div>
      </DialogActions>
      <canvas className={classes.hiddenCanvas} ref={canvasRef} />
    </Dialog>
  );
};

const AvatarUploader = ({ onUpload, src, alt, maxSizeBytes = 1048576 }: AvatarUploaderProps) => {
  const classes = useStyles();
  const fileInput = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState('');
  const [selectedImageData, setSelectedImageData] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);

  const onButtonClick = () => {
    fileInput?.current?.click();
  };

  const selectImg = (file: File) => {
    if (file.size > maxSizeBytes) {
      setFileError(`图片大小不能超过 ${numeral(maxSizeBytes).format('0.0 b')}`);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImageData(reader.result as string);
      setCropperOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const ignoreDrag = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const { files } = dt;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    selectImg(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    selectImg(file);
  };

  const onComplete = async (dataURL: string) => {
    await onUpload(dataURL);
    setCropperOpen(false);
    fileInput!.current!.value = '';
  };

  return (
    <>
      <Cropper
        src={selectedImageData}
        open={cropperOpen}
        onComplete={onComplete}
        onCancel={() => {
          setCropperOpen(false);
          fileInput!.current!.value = '';
        }}
      />
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={(
          <Tooltip title="上传头像">
            <Fab
              size="medium"
              onClick={onButtonClick}
              onDragEnter={ignoreDrag}
              onDragOver={ignoreDrag}
              onDrop={onDrop}
            >
              <PhotoCameraIcon />
            </Fab>
          </Tooltip>
        )}
      >
        <input
          ref={fileInput}
          className={classes.fileInput}
          type="file"
          onChange={onInputChange}
          accept="image/*"
        />
        <Avatar
          className={classes.avatar}
          alt={alt}
          src={src}
          component={ButtonBase}
          onClick={onButtonClick}
          onDragEnter={ignoreDrag}
          onDragOver={ignoreDrag}
          onDrop={onDrop}
        >
          {alt && alt[0]}
        </Avatar>
      </Badge>
      <Collapse in={!!fileError}>
        <Alert className={classes.alert} severity="error" onClose={() => setFileError('')}>
          {fileError}
        </Alert>
      </Collapse>
    </>
  );
};

export default AvatarUploader;
