import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import TrackPin from './TrackPin';
import PlaylistPin from './PlaylistPin';
import { SimpliedPlaylist, Track } from '@/spotify';

interface Props {
    itemType: 'track' | 'playlist';
    items: Track[] | SimpliedPlaylist[];
}

const ScrollablePinCollection: React.FC<Props> = ({ itemType, items }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <SafeAreaView style={styles.gridView}>
                {items.map((item, index) => {
                    return itemType === 'track' ? (
                        <TrackPin key={index} index={index} data={item as Track} />
                    ) : (
                        <PlaylistPin key={index} index={index} data={item as SimpliedPlaylist} />
                    );
                })}
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    gridView: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default ScrollablePinCollection;
