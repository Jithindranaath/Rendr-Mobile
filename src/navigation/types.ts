import { NativeStackScreenProps } from '@react-navigation/native-stack';

// src/navigation/types.ts
export type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    CreatorProfile: {
        id: string;
        name: string;
        image: any;
        bio: string;
        verified: boolean;
    };
    Upload: { projectName?: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type CreatorProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'CreatorProfile'>;
export type UploadScreenProps = NativeStackScreenProps<RootStackParamList, 'Upload'>;
