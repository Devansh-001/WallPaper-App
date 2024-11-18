import { View, Text, StyleSheet, Button, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import {
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Extrapolation, FadeIn, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hp, capitalise } from "../helpers/common"
import { theme } from "../constants/theme"
import { data } from "../constants/data"
import SectionView, { CommonFilterRow, ColorFilterRow } from './filterView';
import Animated from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';


const FiltersModal = ({ modalRef, filters, setFilters, onClose, onApply, onReset }) => {

    const snapPoints = useMemo(() => ['70%'], []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ gap: 15 }}>
                <BottomSheetModal
                    index={0}
                    ref={modalRef}
                    snapPoints={snapPoints}
                    backdropComponent={CustomBackdrop}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <View style={styles.content}>
                            <Text style={styles.filterText}>Filters</Text>
                            {Object.keys(sections).map((sectionName, index) => {
                                let sectionView = sections[sectionName];
                                let sectionData = data.filters[sectionName]
                                let title = capitalise(sectionName)
                                return (
                                    <Animated.View
                                        entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                                        key={sectionName}>
                                        <SectionView
                                            title={title}
                                            content={sectionView({
                                                data: sectionData,
                                                filters,
                                                setFilters,
                                                filterName: sectionName
                                            })}
                                        />
                                    </Animated.View>
                                );
                            })
                            }

                            {/* Actions */}
                            <Animated.View
                                entering={FadeInDown.delay(500).springify().damping(11)}
                                style={styles.buttons}>

                                <Pressable style={styles.resetButton} onPress={onReset}>
                                    <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
                                </Pressable>

                                <Pressable style={styles.applyButton} onPress={onApply}>
                                    <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
                                </Pressable>

                            </Animated.View>

                        </View>

                    </BottomSheetView>
                </BottomSheetModal>
            </ScrollView>

        </View >
    )
}


const sections = {
    "order": (props) => <CommonFilterRow {...props} />,
    "orientation": (props) => <CommonFilterRow {...props} />,
    "type": (props) => <CommonFilterRow {...props} />,
    "colors": (props) => <ColorFilterRow {...props} />,
}





const CustomBackdrop = ({ animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => {

        if (typeof animatedIndex !== 'number' || isNaN(animatedIndex)) {
            return { opacity: 0 }; // default to opacity 0 if invalid
        }

        let opacity = interpolate(animatedIndex, [-1, 0], [0, 1], Extrapolation.CLAMP);
        return { opacity };
    })
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ]



    return (
        <Animated.View style={containerStyle}>
            <BlurView
                intensity={25}
                tint='dark'
                style={StyleSheet.absoluteFill}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({


    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    content: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 15,
        width: "100%",
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderCurve: "continuous"
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderCurve: "continuous",
        borderWidth: 2,
        borderColor: theme.colors.grayBG
    },
    buttonText: {
        fontSize: hp(2.2)
    }


})
export default FiltersModal