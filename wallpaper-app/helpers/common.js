import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage) => {
    const width = deviceWidth;
    return (width * percentage) / 100;
}
export const hp = (percentage) => {
    const height = deviceHeight;
    return (height * percentage) / 100;
}

export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        return 4;
    }
    else if (deviceWidth >= 768) {
        return 3;
    }
    else {
        return 2;
    }
}

export const getImageSize = (height, width) => {
    if (width > height) {
        return 250;
    }
    else if (width < height) {
        return 300;
    }
    else {
        return 200;
    }
}

export const capitalise = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}