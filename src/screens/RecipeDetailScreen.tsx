import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Recipe } from '../types';
import { getRecipeById } from '../services/recipeService';

export default function RecipeDetailScreen({ route }: any) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const { recipeId } = route.params;

    useEffect(() => {
        loadRecipe();
    }, [recipeId]);

    const loadRecipe = async () => {
        setLoading(true);
        try {
            const data = await getRecipeById(recipeId);
            setRecipe(data);
        } catch (error) {
            console.error('Error loading recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Recipe not found</Text>
            </View>
        );
    }

    const totalTime = recipe.prepTime + recipe.cookTime;
    const cuisineFlag = recipe.cuisine === 'indian' ? '🇮🇳' : '🌎';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {cuisineFlag} {recipe.name}
                    </Text>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>⏱️ Prep</Text>
                            <Text style={styles.metaValue}>{recipe.prepTime}m</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>🍳 Cook</Text>
                            <Text style={styles.metaValue}>{recipe.cookTime}m</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>🍽️ Serves</Text>
                            <Text style={styles.metaValue}>{recipe.servings}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>📊 Level</Text>
                            <Text style={styles.metaValue}>{recipe.difficulty}</Text>
                        </View>
                    </View>
                </View>

                {/* Macros */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
                    <View style={styles.macrosGrid}>
                        <View style={[styles.macroCard, { backgroundColor: '#e8f5e9' }]}>
                            <Text style={styles.macroValue}>{recipe.macros.protein}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={[styles.macroCard, { backgroundColor: '#fff3e0' }]}>
                            <Text style={styles.macroValue}>{recipe.macros.carbs}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={[styles.macroCard, { backgroundColor: '#fce4ec' }]}>
                            <Text style={styles.macroValue}>{recipe.macros.fats}g</Text>
                            <Text style={styles.macroLabel}>Fats</Text>
                        </View>
                        <View style={[styles.macroCard, { backgroundColor: '#e3f2fd' }]}>
                            <Text style={styles.macroValue}>{recipe.macros.calories}</Text>
                            <Text style={styles.macroLabel}>Calories</Text>
                        </View>
                    </View>
                </View>

                {/* Ingredients */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {recipe.ingredients.map((item, index) => (
                        <View key={index} style={styles.ingredientItem}>
                            <Text style={styles.ingredientBullet}>•</Text>
                            <Text style={styles.ingredientText}>
                                {item.quantity} {item.ingredient.name}
                                {item.optional && <Text style={styles.optionalText}> (optional)</Text>}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {recipe.instructions.map((instruction, index) => (
                        <View key={index} style={styles.instructionItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                    ))}
                </View>

                {/* Tags */}
                {recipe.tags.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tags</Text>
                        <View style={styles.tagsContainer}>
                            {recipe.tags.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
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
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7f8c8d',
    },
    errorText: {
        fontSize: 18,
        color: '#e74c3c',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    metaItem: {
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    metaValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        textTransform: 'capitalize',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 12,
    },
    macrosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    macroCard: {
        flex: 1,
        minWidth: '45%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 12,
    },
    macroValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    ingredientItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
    },
    ingredientBullet: {
        fontSize: 18,
        color: '#4CAF50',
        marginRight: 12,
        fontWeight: 'bold',
    },
    ingredientText: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
        lineHeight: 24,
    },
    optionalText: {
        fontSize: 14,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    instructionItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    instructionText: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
        lineHeight: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#1976d2',
        fontWeight: '500',
    },
});
