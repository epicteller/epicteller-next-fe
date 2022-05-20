import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
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
import React, { useEffect, useRef, useState } from 'react';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import numeral from 'numeral';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { makeStyles } from '@mui/styles';
import { useMeasure } from 'react-use';
import useNotifier from '../../hooks/notifier';
import ScrollBar from '../util/ScrollBar';

export interface AvatarUploaderProps {
  src?: string
  alt?: string
  maxSizeBytes?: number
  onUpload?: (dataURL: string) => void
  readOnly?: boolean
}

export interface CropperProps {
  src: string
  height: number
  width: number
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

const initialCrop: (windowWidth: number, windowHeight: number, width: number, height: number) => Crop = (
  windowWidth,
  windowHeight,
) => {
  const shorter = Math.min(windowWidth, windowHeight);
  return {
    unit: 'px',
    x: 0,
    y: 0,
    width: shorter * 0.3,
    height: shorter * 0.3,
  };
};

const Cropper = ({
  src, width, height, open = false, onComplete, onCancel = () => {
  },
}: CropperProps) => {
  const classes = useStyles();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [windowRef, { width: windowWidth, height: windowHeight }] = useMeasure();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentCrop, setCurrentCrop] = useState<Crop>(initialCrop(windowWidth, windowHeight, width, height));
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const canvasToPreview = () => {
    const url = canvasRef?.current?.toDataURL();
    if (!url) {
      return;
    }
    setPreview(url);
  };

  useEffect(() => {
    setCurrentCrop(initialCrop(windowWidth, windowHeight, width, height));
  }, [windowWidth, windowHeight, width, height]);

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
  }, [completedCrop, src]);

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
    <Dialog open={open} onClose={onDialogClose} maxWidth="lg">
      <DialogTitle>上传头像</DialogTitle>
      <DialogContent sx={{ overflow: 'hidden' }}>
        <Grid container spacing={3}>
          <Grid item xs sm={8}>
            <Box ref={windowRef}>
              <Typography variant="subtitle2" gutterBottom>裁剪</Typography>
              <ScrollBar
                style={{ maxHeight: '75vh', overflowX: 'hidden' }}
                options={{
                  overflowBehavior: { x: 'hidden' },
                }}
              >
                <ReactCrop
                  aspect={1}
                  crop={currentCrop}
                  onChange={(c) => setCurrentCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  circularCrop
                  keepSelection
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} ref={imgRef} alt="图片" />
                </ReactCrop>
              </ScrollBar>
            </Box>
          </Grid>
          <Grid item xs sm={4}>
            <Typography variant="subtitle2" gutterBottom>预览</Typography>
            <Avatar className={classes.avatar} src={preview} />
            <Avatar className={classes.avatarMedium} src={preview} />
            <Avatar src={preview} />
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

const AvatarUploader = ({ onUpload, src, alt, readOnly = false, maxSizeBytes = 10 * 1048576 }: AvatarUploaderProps) => {
  const classes = useStyles();
  const fileInput = useRef<HTMLInputElement>(null);
  const { notifyError } = useNotifier();

  const [selectedImageData, setSelectedImageData] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [cropperOpen, setCropperOpen] = useState(false);

  const onButtonClick = () => {
    fileInput?.current?.click();
  };

  const selectImg = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImageData(reader.result as string);
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
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
    if (dataURL.length > maxSizeBytes) {
      notifyError(`图片大小不能超过 ${numeral(maxSizeBytes).format('0.0 b')}`);
      return;
    }
    try {
      if (onUpload) {
        await onUpload(dataURL);
      }
    } catch {
      return;
    }
    setCropperOpen(false);
    fileInput!.current!.value = '';
  };

  if (readOnly) {
    return (
      <Avatar
        className={classes.avatar}
        alt={alt}
        src={src}
      >
        {alt && alt[0]}
      </Avatar>
    );
  }

  return (
    <>
      <Cropper
        src={selectedImageData}
        width={imageWidth}
        height={imageHeight}
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
    </>
  );
};

export default AvatarUploader;
