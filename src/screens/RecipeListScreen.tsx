import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Recipe } from '../types';
import { getAllRecipes, getRecipesByMealType } from '../services/recipeService';

export default function RecipeListScreen({ navigation, route }: any) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { mealType } = route.params || {};

    useEffect(() => {
        loadRecipes();
    }, [mealType]);

    const loadRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Loading recipes for meal type:', mealType);
            const data = mealType
                ? await getRecipesByMealType(mealType)
                : await getAllRecipes();
            console.log('Loaded recipes count:', data.length);
            if (data.length > 0) {
                console.log('First recipe:', JSON.stringify(data[0], null, 2));
            }
            setRecipes(data);
        } catch (err) {
            console.error('Error loading recipes:', err);
            setError(err instanceof Error ? err.message : 'Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const renderRecipeCard = ({ item }: { item: Recipe }) => {
        try {
            const totalTime = (item.prepTime || 0) + (item.cookTime || 0);
            const cuisineFlag = item.cuisine === 'indian' ? '🇮🇳' : '🌎';

            return (
                <TouchableOpacity
                    style={styles.recipeCard}
                    onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.recipeName} numberOfLines={2}>
                            {cuisineFlag} {item.name}
                        </Text>
                        <View style={[styles.difficultyBadge, getDifficultyStyle(item.difficulty)]}>
                            <Text style={styles.difficultyText}>{item.difficulty}</Text>
                        </View>
                    </View>

                    <View style={styles.cardBody}>
                        {/* Macros */}
                        <View style={styles.macrosContainer}>
                            <View style={styles.macroItem}>
                                <Text style={styles.macroValue}>{item.macros?.protein || 0}g</Text>
                                <Text style={styles.macroLabel}>Protein</Text>
                            </View>
                            <View style={styles.macroItem}>
                                <Text style={styles.macroValue}>{item.macros?.calories || 0}</Text>
                                <Text style={styles.macroLabel}>Cal</Text>
                            </View>
                            <View style={styles.macroItem}>
                                <Text style={styles.macroValue}>{totalTime}m</Text>
                                <Text style={styles.macroLabel}>Time</Text>
                            </View>
                        </View>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                            <View style={styles.tagsContainer}>
                                {item.tags.slice(0, 3).map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            );
        } catch (err) {
            console.error('Error rendering recipe card:', err, item);
            return (
                <View style={styles.errorCard}>
                    <Text style={styles.errorText}>Error displaying recipe: {item.name}</Text>
                </View>
            );
        }
    };

    const getDifficultyStyle = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return { backgroundColor: '#4CAF50' };
            case 'medium':
                return { backgroundColor: '#FF9800' };
            case 'hard':
                return { backgroundColor: '#F44336' };
            default:
                return { backgroundColor: '#9E9E9E' };
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {mealType ? `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Recipes` : 'All Recipes'}
                </Text>
                <Text style={styles.headerSubtitle}>{recipes.length} recipes found</Text>
            </View>

            <FlatList
                data={recipes}
                renderItem={renderRecipeCard}
                keyExtractor={(item, index) => item.id || `recipe-${index}`}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7f8c8d',
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorCard: {
        backgroundColor: '#ffebee',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    retryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
    },
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    recipeName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginRight: 8,
    },
    difficultyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'capitalize',
    },
    cardBody: {
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
    },
    macroItem: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    macroLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 2,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#1976d2',
        fontWeight: '500',
    },
});
