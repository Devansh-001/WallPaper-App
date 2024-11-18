import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { capitalise, hp } from "../helpers/common"
import { theme } from "../constants/theme"

const SectionView = ({ title, content }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}> {title} </Text>
            <View>
                {content}
            </View>
        </View>
    )
}


export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onselect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
                    let color = isActive ? "white" : theme.colors.neutral(0.7);
                    return (

                        <Pressable
                            key={item}
                            style={[styles.outlinedButton, { backgroundColor }]}
                            onPress={() => onselect(item)}
                        >
                            <Text
                                style={[styles.outlinedButtonText, { color }]}
                            >{capitalise(item)}</Text>
                        </Pressable>
                    )
                })
            }
        </View>

    )
}


export const ColorFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onselect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let borderColor = isActive ? theme.colors.neutral(0.7) : "white";
                    return (

                        <Pressable
                            key={item}
                            onPress={() => onselect(item)}
                        >
                            <View style={[styles.colorWrapper,{borderColor}]}>
                                <View style={[styles.color, { backgroundColor: item }]}>

                                </View>
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>

    )
}


const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.8)
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    outlinedButton: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.xs,
        borderCurve: "continuous",
    },
    colorWrapper: {
        padding: 3,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderCurve: "continuous"
    },
    color: {
        height: 30,
        width: 40,
        borderRadius: theme.radius.sm - 3,
        borderCurve: "continuous"
    }
})

export default SectionView;