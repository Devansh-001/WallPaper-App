import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './ImageCard';
import { getColumnCount, hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';

const ImageGrid = ({ images, router }) => {


    const columns = getColumnCount();

    return (
        <View style={styles.container}>
            <MasonryFlashList
                initialNumToRender={1000}
                contentContainerStyle={styles.listContainerStyle}
                data={images}
                numColumns={columns}
                renderItem={({ item, index }) => <ImageCard item={item} index={index} router={router} />}
                estimatedItemSize={200}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(100),
        minHeight: 3,

    },
    listContainerStyle: {
        paddingHorizontal: wp(4),
    }
})

export default ImageGrid