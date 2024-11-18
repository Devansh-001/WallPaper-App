import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { data } from "../constants/data"
import { theme } from "../constants/theme"
import { wp, hp } from '../helpers/common'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({ activeCategory, handleChangeCategory }) => {
    return (
        <FlatList
            horizontal
            contentContainerStyle={styles.flatListContainer}
            showsHorizontalScrollIndicator={false}
            data={data.categories}
            keyExtractor={item => item}
            renderItem={({ item, index }) => {

                return (
                    <CategoryItem
                        title={item}
                        index={index}
                        isActive={activeCategory == item}
                        handleChangeCategory={handleChangeCategory}
                    />
                )
            }}
        />

    )
}

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {

    const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
    const backgroundColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;
    return (
        <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
            <Pressable onPress={() => handleChangeCategory(isActive ? null : title)}
                style={[styles.category, { backgroundColor }]}

            >
                <Text style={[styles.title, { color }]}> {title} </Text>
            </Pressable>

        </Animated.View >
    )
}

const styles = StyleSheet.create({
    flatListContainer: {
        paddingHorizontal: wp(4),
        gap: 8,
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium
    }
})

export default Categories