import {
    SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ScrollablePinCollection from '@/components/ScrollablePinCollection';
import { Track, getRecommendations } from '@/spotify';
import { getRecommendationData } from '@/database';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSession from '@/hooks/useSession';

export default function Home() {
    const session = useSession();
    const [tracks, setTracks] = useState<Track[]>([]);

    const scrollViewRef = useRef<ScrollView>(null);
    const refreshButtonRef = useRef<TouchableOpacity>(null);
    const [addLocked, setAddLocked] = useState<boolean>(false);
    const refreshButtonHandler = async () => {
        if (addLocked) {
            return;
        }
        setAddLocked(true);

        try {
            console.log('Refeshing recommended tracks...');
            setTracks([]);
            const data = await getRecommendationData();
            const recommendedTracks = await getRecommendations(
                session.accessToken, data.genres, data.trackIDs
            );
            setTracks(recommendedTracks);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        } catch (error) {
            console.log(error);
        }

        setTimeout(() => {
            setAddLocked(false);
        }, 3000);
    };
    useEffect(() => {
        refreshButtonHandler().then(res => { }).catch(error => console.log(error));
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <ScrollView ref={scrollViewRef}>
                    <View style={styles.header}>
                        <Text style={styles.subHeaderText}>
                            {tracks.length === 0 ?
                                'Wow, such empty'
                                : 'Your recommended tracks'}
                        </Text>
                    </View>
                    <ScrollablePinCollection itemType='track' items={tracks} />
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity
                    ref={refreshButtonRef}
                    onPress={refreshButtonHandler}
                    style={styles.refreshButton}
                >
                    <SimpleLineIcons name="refresh" size={36} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 18,
        color: 'white',
    },
    refreshButton: {
        position: 'absolute',
        alignSelf: 'auto',
        left: 120,
        bottom: 20,
        backgroundColor: 'green',
        borderRadius: 10000,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },
});
