import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import {
  useGetJob,
  usePostVehiclePhoto,
} from '@/app/(app)/jobs/(index)/[id]/_api';
import { useSelectedVehicleTabIdValue } from '@/app/(app)/jobs/(index)/[id]/_atoms';
import { UnlockedOnly } from '@/app/(app)/jobs/(index)/[id]/_components/UnlockedOnly';
import { useJobId } from '@/app/(app)/jobs/(index)/[id]/_hooks';
import { Progress, Text, TextButton, toast } from '@/components';
import { Box, Center, Flex } from '@/styled-system/jsx';

import { PhotosDrawerImageList } from './PhotosDrawerImageList';

const imageToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result;

      if (!base64) {
        reject(new Error('Failed to convert image to base64'));
        return;
      }

      resolve(base64.toString());
    };

    reader.onerror = error => {
      reject(error);
    };
  });

export function PhotosDrawerContent() {
  const jobId = useJobId();

  const selectedVehicleTabId = useSelectedVehicleTabIdValue();

  const [amountOfPhotosToBeUploaded, setAmountOfPhotosToBeUploaded] =
    useState(0);
  const [photosToBeUploadedQueue, setPhotosToBeUploadedQueue] = useState<
    Array<{ file: File; base64: string }>
  >([]);
  const [currentPhotoUploadPercentage, setCurrentPhotoUploadPercentage] =
    useState(0);

  const getJob = useGetJob(jobId);

  const postVehiclePhoto = usePostVehiclePhoto({
    onUploadProgress: setCurrentPhotoUploadPercentage,
    onSuccess(data) {
      getJob.updateData({
        jobVehicles: getJob.data?.jobVehicles.map(vehicle =>
          vehicle.id === data.vehicleId
            ? {
                ...vehicle,
                jobPhotos: [data, ...(vehicle.jobPhotos ?? [])],
              }
            : vehicle
        ),
      });

      toast.success(
        `Photo ${
          amountOfPhotosToBeUploaded === 1
            ? ''
            : amountOfPhotosToBeUploaded - photosToBeUploadedQueue.length
        } uploaded successfully`
      );
    },
    onError(error) {
      toast.error(
        `Error while uploading photo${
          amountOfPhotosToBeUploaded === 1
            ? ''
            : ` ${amountOfPhotosToBeUploaded - photosToBeUploadedQueue.length}`
        }${error instanceof Error ? `: ${error.message}` : ''}`
      );
    },
    onSettled() {
      setCurrentPhotoUploadPercentage(0);

      if (photosToBeUploadedQueue.length === 0) {
        setAmountOfPhotosToBeUploaded(0);
      }

      if (photosToBeUploadedQueue.length > 0) {
        const [firstImage, ...rest] = photosToBeUploadedQueue;

        if (!selectedVehicleTabId) {
          return;
        }

        postVehiclePhoto.mutate({
          jobId,
          vehicleId: selectedVehicleTabId,
          imageBase64: firstImage.base64,
          imageType: firstImage.file.type,
        });

        setPhotosToBeUploadedQueue(rest);
      }
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: postVehiclePhoto.isLoading,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    async onDrop(acceptedFiles) {
      const [firstImage, ...rest] = acceptedFiles;

      if (!firstImage || !selectedVehicleTabId) {
        return;
      }

      const [firstImageOnBase64, ...otherImagesOnBase64] = await Promise.all([
        imageToBase64(firstImage),
        ...rest.map(imageToBase64),
      ]);

      postVehiclePhoto.mutate({
        jobId,
        vehicleId: selectedVehicleTabId,
        imageBase64: firstImageOnBase64,
        imageType: firstImage.type,
      });
      setAmountOfPhotosToBeUploaded(acceptedFiles.length);
      setPhotosToBeUploadedQueue(
        rest.map((file, index) => ({
          file,
          base64: otherImagesOnBase64[index],
        }))
      );
    },
    onDropRejected(fileRejections) {
      const [rejection] = fileRejections;

      if (rejection.errors[0].code === 'file-too-large') {
        toast.error('File size exceeds 5MB.');
        return;
      }

      toast.error('Invalid file type. Please upload a JPG/JPEG or PNG file.');
    },
  });

  return (
    <Flex direction="column" gap={5} p={5} maxH="100%">
      <UnlockedOnly>
        <Flex
          {...getRootProps()}
          direction="column"
          h="5.25rem"
          gap={2.3}
          px={3}
          flexShrink={0}
          justify="center"
          align="center"
          borderWidth="1.5px"
          borderStyle="dashed"
          bgColor={isDragActive ? 'rgba(0, 204, 102, 0.04)' : undefined}
          borderColor={isDragActive ? 'primary' : 'gray.300'}
          opacity={postVehiclePhoto.isLoading ? 0.5 : 1}
          pointerEvents={postVehiclePhoto.isLoading ? 'none' : 'auto'}
          rounded="lg"
          transitionProperty="background-color, border-color, opacity"
          transitionDuration="fast"
          transitionTimingFunction="ease-in-out"
        >
          <input {...getInputProps()} />

          <Flex align="center" gap={1}>
            <Text fontWeight="medium">Drop photos here to upload, or</Text>
            <TextButton tabIndex={postVehiclePhoto.isLoading ? -1 : undefined}>
              browse
            </TextButton>
          </Flex>

          <Text fontSize="2xs.xl" fontWeight="medium" color="gray.400">
            JPG/JPEG or PNG
          </Text>
        </Flex>
      </UnlockedOnly>

      <Flex
        direction="column"
        gap={3}
        overflow="auto"
        width="calc(100% + token(spacing.2))"
        pr={2}
        pb={5}
        mb={10}
      >
        {postVehiclePhoto.isLoading && (
          <Center
            minH="23rem"
            flexDir="column"
            gap={2.3}
            rounded="md.xl"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Text fontWeight="medium">
              Uploading{' '}
              {amountOfPhotosToBeUploaded - photosToBeUploadedQueue.length} of{' '}
              {amountOfPhotosToBeUploaded}...
            </Text>
            <Box w={40}>
              <Progress value={currentPhotoUploadPercentage} />
            </Box>
          </Center>
        )}

        <PhotosDrawerImageList />
      </Flex>
    </Flex>
  );
}
