import {
    StyleSheet, Text, View, Image, Button, Pressable, SafeAreaView
} from 'react-native'
import React from 'react'

export default function ReportBugs() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Report Bugs</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151718'
    },
    text: {
        color: '#ECEDEE',
        fontSize: 15,
        fontWeight: '500',
    },
});