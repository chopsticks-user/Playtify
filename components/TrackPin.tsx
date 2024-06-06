import React, { useState } from 'react';
import { usePinDimensions } from '@/hooks/usePinDimensions';
import { Track } from '@/spotify';
import {
    Pressable, View, StyleSheet, Text,
    ImageBackground, TouchableOpacity
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface Props {
    index: number;
    data: Track;
    openBrowserAction?: (url: string) => Promise<void>;
}

function getDurationString(duration_ms?: number): string {
    const duration_mins = duration_ms === undefined
        ? 3
        : Math.floor(duration_ms / 60000);
    const duration_secs = duration_ms === undefined
        ? 3
        : Math.round((duration_ms % (duration_mins * 60000)) / 1000);
    return duration_ms === undefined
        ? '?:??'
        : `${duration_mins}:${duration_secs}`;
}

export default function TrackPin(props: Props) {
    const [width, height] = usePinDimensions(styles.itemContainer.margin);
    const duration = getDurationString(props.data.duration_ms);
    const imageURI = props.data.album.images[0].url;

    const [add, setAdd] = useState<boolean>(false);
    const [addLocked, setAddLocked] = useState<boolean>(false);

    const addButtonHandler = () => {
        if (addLocked) {
            return;
        }
        setAddLocked(true);

        setTimeout(() => {
            setAddLocked(false);
        }, 1500);

        setAdd(!add);
    };

    return (
        <Pressable key={props.index}>
            <ImageBackground
                source={{ uri: imageURI }}
                style={[
                    styles.itemContainer,
                    {
                        minWidth: width,
                        maxWidth: width,
                        minHeight: height,
                        maxHeight: height,
                    }
                ]}
                imageStyle={{ borderRadius: 10 }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={addButtonHandler}>
                        {add ? (
                            <Ionicons name="checkmark-circle" size={36} color="green" />
                        ) : (
                            <Ionicons name="add-circle" size={36} color="green" />
                        )}
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}></View>
                    <TouchableOpacity
                        onPress={async () => {
                            const url = props.data.external_urls?.spotify;
                            if (url !== undefined && props.openBrowserAction) {
                                await props.openBrowserAction(url);
                            }
                        }}
                    >
                        <FontAwesome name="spotify" size={36} color="green" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}></View>
                <View
                    style={[
                        styles.textWrapper,
                        {
                            backgroundColor: imageURI === undefined ?
                                styles.itemContainer.backgroundColor : '#000000a0',
                        }
                    ]}
                >
                    <Text style={styles.itemName}>{props.data.name}</Text>
                    <Text style={styles.itemCode}>
                        {props.data.artists.map(artist => artist.name).join(' \u25cf ')}
                    </Text>
                    <Text style={styles.itemCode}>
                        {props.data.album.name + ' \u25cf ' + props.data.album.release_date}
                    </Text>
                    <Text style={styles.itemCode}>{'\u25b6 ' + duration}</Text>
                </View>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#262626',
        justifyContent: 'flex-end',
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    textWrapper: {
        padding: 10,
        borderRadius: 10,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        flexWrap: 'wrap',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 13,
        color: '#fff',
        flexWrap: 'wrap',
    },
});
