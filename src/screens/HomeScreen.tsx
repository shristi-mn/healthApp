import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';

export default function HomeScreen({ navigation }: any) {
    const navigateToRecipes = (mealType?: string) => {
        navigation.navigate('RecipeList', { mealType });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Find Healthy Recipes</Text>
                    <Text style={styles.subtitle}>
                        High-protein meals for a healthier you! 💪
                    </Text>
                </View>

                {/* Meal Type Cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Browse by Meal</Text>

                    <TouchableOpacity
                        style={[styles.card, styles.breakfastCard]}
                        onPress={() => navigateToRecipes('breakfast')}
                    >
                        <Text style={styles.cardEmoji}>🍳</Text>
                        <Text style={styles.cardTitle}>Breakfast</Text>
                        <Text style={styles.cardSubtitle}>Start your day right</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.lunchCard]}
                        onPress={() => navigateToRecipes('lunch')}
                    >
                        <Text style={styles.cardEmoji}>🥗</Text>
                        <Text style={styles.cardTitle}>Lunch</Text>
                        <Text style={styles.cardSubtitle}>Midday fuel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.dinnerCard]}
                        onPress={() => navigateToRecipes('dinner')}
                    >
                        <Text style={styles.cardEmoji}>🍛</Text>
                        <Text style={styles.cardTitle}>Dinner</Text>
                        <Text style={styles.cardSubtitle}>Evening delights</Text>
                    </TouchableOpacity>
                </View>

                {/* All Recipes Button */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.allRecipesButton}
                        onPress={() => navigateToRecipes()}
                    >
                        <Text style={styles.allRecipesText}>📚 View All Recipes</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>39</Text>
                        <Text style={styles.statLabel}>Recipes</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>25g+</Text>
                        <Text style={styles.statLabel}>Protein</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>2</Text>
                        <Text style={styles.statLabel}>Cuisines</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 15,
    },
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    breakfastCard: {
        backgroundColor: '#fff3e0',
    },
    lunchCard: {
        backgroundColor: '#e8f5e9',
    },
    dinnerCard: {
        backgroundColor: '#e3f2fd',
    },
    cardEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    allRecipesButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    allRecipesText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
});
