import React, { useEffect } from 'react';
import { Text, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolate
} from 'react-native-reanimated';

interface AnimatedShinyTextProps {
    text: string;
    textStyle?: StyleProp<TextStyle>;
    shimmerWidth?: number;
}

export const AnimatedShinyText: React.FC<AnimatedShinyTextProps> = ({
    text,
    textStyle,
    shimmerWidth = 100
}) => {
    const shimmerValue = useSharedValue(0);

    useEffect(() => {
        shimmerValue.value = withRepeat(
            withTiming(1, {
                duration: 2000, // Duration of one shine pass
                easing: Easing.linear,
            }),
            -1, // Infinite repeat
            false // Do not reverse (play forward only)
        );
    }, []);

    const animatedGradientStyle = useAnimatedStyle(() => {
        // Move the gradient from left (-100%) to right (100%)
        const translateX = interpolate(shimmerValue.value, [0, 1], [-shimmerWidth * 2, shimmerWidth * 2]);
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <MaskedView
            style={{ height: 40, alignSelf: 'center' }} // Adjust height to fit font size
            maskElement={
                <View style={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text, textStyle]}>{text}</Text>
                </View>
            }
        >
            {/* Background Layer: Base Text Color (Dark Grey) */}
            <View style={{ flex: 1, backgroundColor: '#4B5563', alignItems: 'center', justifyContent: 'center' }}>
                {/* This renders the base color text invisibly just to hold space, or we can use absolute positioning. 
             Ideally, MaskedView reveals the child. */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#4B5563' }]} />

                {/* Top Layer: The Moving Shine (White Gradient) */}
                <Animated.View style={[StyleSheet.absoluteFill, animatedGradientStyle]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Animated.View>
            </View>
        </MaskedView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', // The mask needs to be opaque
    },
});