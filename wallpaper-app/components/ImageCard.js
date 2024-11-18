import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { hp, wp, getImageSize } from '../helpers/common'
import { theme } from '../constants/theme';

const ImageCard = ({ item, index, router }) => {


  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) }
  }
  return (
    <Pressable style={styles.imageWrapper}
      onPress={() => router.push({ pathname: "home/images", params: { ...item } })}
    >

      <Image
        style={[styles.image, getImageHeight()]}
        source={{ uri: item.webformatURL }}
        transition={100}
      />

    </Pressable>
  )
}


const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: 'hidden',
    margin: wp(1),
  }
})
export default ImageCard