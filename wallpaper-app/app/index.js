import { View, Image, StyleSheet, StatusBar, Text, Pressable } from 'react-native'
import React from 'react'
import { wp, hp } from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { theme } from "../constants/theme"
import { useRouter } from 'expo-router'



export default function WelcomeScreen() {

    const router = useRouter();
    
    return (
        <View style={styles.container}>

            <StatusBar style="auto" />

            <Image
                source={{ uri: "https://images.unsplash.com/photo-1581386890056-f75c085484b3?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                style={styles.bgimage}
                resizeMode='cover'
            />


            <Animated.View
                entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white']}
                    style={styles.gradient}
                    start={{ x: 0.3, y: 0 }}
                    end={{ x: 0.3, y: 0.95 }}
                    
                />
                <View style={styles.contentContainer}>

                    <Animated.Text
                        entering={FadeInDown.delay(400).springify()}
                        style={styles.title}>
                        Ephemera
                    </Animated.Text>


                    <Animated.Text
                        entering={FadeInDown.delay(500).springify()}
                        style={styles.punchline}>
                        Capture the Beauty of the Moment.
                    </Animated.Text>


                    <Animated.View
                        entering={FadeInDown.delay(600).springify()}>
                        <Pressable onPress={() => router.push("home")} style={styles.startButton}>
                            <Text style={styles.startText}>Start Exploring</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bgimage: {
        width: wp(100),
        height: hp(100),
        position: "absolute",
    },
    gradient: {
        width: wp(100),
        height: hp(65),
        bottom: 0,
        position: "absolute",
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,

    },
    title: {
        fontSize: hp(7),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold,
        fontVariants: "cursive"
    },
    punchline: {
        fontSize: hp(2),
        letterSpacing: 1,
        marginBottom: 10,
        fontWeight: theme.fontWeights.medium
    },
    startButton: {
        marginBottom: 80,
        backgroundColor: theme.colors.neutral(0.9),
        padding: 15,
        paddingHorizontal: 90,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    startText: {
        color: theme.colors.white,
        fontSize: hp(3),
        fontWeight: theme.fontWeights.medium,
        letterSpacing: 1,
    }

})