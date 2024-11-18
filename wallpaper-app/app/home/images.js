import { View, Text, StyleSheet, Button, Image, Platform, ActivityIndicator, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '../../helpers/common'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { theme } from '../../constants/theme'
import { Octicons } from '@expo/vector-icons'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';






const ImageScreen = () => {
    const router = useRouter();
    const item = useLocalSearchParams();

    const fileName = item.previewURL.split('/').pop();
    const imageUrl = item.webformatURL;
    const filePath = `${FileSystem.documentDirectory}${fileName}`


    const [status, setStatus] = useState('loading');
    const [isDownloading, setIsDownloading] = useState('');
    const [isSharing, setIsSharing] = useState('');


    const onLoad = () => {
        setStatus("");
    }

    const getSize = () => {
        const aspectRatio = item.imageWidth / item.imageHeight;

        const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);

        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedwidth = maxWidth;

        if (aspectRatio < 1) {
            calculatedwidth = calculatedHeight * aspectRatio;
        }
        return {
            width: calculatedwidth,
            height: calculatedHeight,
        }

    }


    const handleDownload = async () => {
        if (Platform.OS == "web") {
            const anchor = document.createElement('a');
            anchor.href = imageUrl;
            anchor.target = '_blank';
            anchor.download = fileName || "download"
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
        else {
            setIsDownloading("downloading")
            let uri = await downloadFile();
            if (uri) {
                showToast("Image Downloaded");
            }
        }
    }

    const handleShare = async () => {
        if (Platform.OS == "web") {
            Clipboard.setString(imageUrl);
            showToast("Link Copied");
        }
        else {
            setIsSharing("sharing");
            const uri = await downloadFile();
            if (uri) {
                await Sharing.shareAsync(uri)
                setIsSharing("");
            }
        }
    }

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
            setIsDownloading('');
            return uri;
        }
        catch (e) {
            console.log("Error", e.message);
            setIsDownloading('');
            Alert.alert('Image', e.message)
            return null;
        }
    }

    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'top'
        });
    }

    return (
        <BlurView
            style={styles.container}
            tint="dark"
            intensity={60}
        >
            <View style={getSize()}>

                <View style={styles.loading}>
                    {status == "loading" && <ActivityIndicator size={"large"} color={"white"} />}
                </View>
                <Image
                    transition={100}
                    source={{ uri: item.webformatURL }}
                    onLoad={onLoad}
                    style={[styles.image, getSize()]}
                />
            </View>
            <View style={styles.buttons} >

                <Animated.View entering={FadeInDown.springify()}>
                    <Pressable style={styles.button} onPress={() => router.back()}>
                        <Octicons name="x" size={24} color="white" />
                    </Pressable>

                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(100)}>
                    {isDownloading == "downloading" ? <ActivityIndicator size={"large"} color={"white"} /> :
                        <Pressable style={styles.button} onPress={handleDownload}>
                            <Octicons name="download" size={24} color="white" />
                        </Pressable>
                    }
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(200)}>
                    {isSharing == "sharing" ? <ActivityIndicator size={"large"} color={"white"} /> :
                        <Pressable style={styles.button} onPress={handleShare}>
                            <Octicons name="share" size={24} color="white" />
                        </Pressable>
                    }

                </Animated.View>

            </View>
            <Toast />
        </BlurView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: "rgb(255,255,255,0.1)",
        borderColor: "rgb(255,255,255,0.1)"
    },
    loading: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    buttons: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
    }
})

export default ImageScreen;