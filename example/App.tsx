import {
    StyleSheet,
    View,
    Text,
    Platform,
    Pressable,
    ScrollView,
    Alert,
} from "react-native";

import {
    Identity,
    Group,
    generateSemaphoreProof,
    verifySemaphoreProof,
} from "semaphore";
import { useState } from "react";

export default function TabOneScreen() {
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [identityInfo, setIdentityInfo] = useState<string>("");
    const [groupInfo, setGroupInfo] = useState<string>("");
    const [proofInfo, setProofInfo] = useState<string>("");

    const initIdentity = async () => {
        try {
            setIsLoading(true);

            // Create a new identity with a random secret
            const secret = "secret";
            const secret2 = "secret2";
            const secretBytes = new TextEncoder().encode(secret);
            const secretBytes2 = new TextEncoder().encode(secret2);
            const identity = new Identity(secretBytes);
            const identity2 = new Identity(secretBytes2);

            // Get identity properties using IdentityModule
            const commitment = identity.commitment();
            const commitment2 = identity2.commitment();
            console.log("commitment", commitment);
            console.log("commitment2", commitment2);

            // Set the identity state
            setIdentity(identity);

            const secretScalar = identity.secretScalar();
            console.log(secretScalar);
            const toElement = identity.toElement();
            console.log(toElement);
            const privateKey = identity.privateKey();
            console.log(privateKey);
            setIdentityInfo(
                `Identity created successfully!\nSecret: ${secret}\nSecret Scalar: ${secretScalar}\nCommitment: ${commitment}\nCommitment 2: ${commitment2}`
            );

            Alert.alert("Success", "Identity initialized successfully!");
        } catch (error) {
            console.error("Error initializing identity:", error);
            Alert.alert("Error", "Failed to initialize identity");
        } finally {
            setIsLoading(false);
        }
    };

    const generateProof = async () => {
        try {
            setIsLoading(true);

            if (!identity) {
                Alert.alert("Error", "Please initialize an identity first");
                return;
            }

            // Create identities for testing
            const secret = "secret";
            const secret2 = "secret2";
            const secretBytes = new TextEncoder().encode(secret);
            const secretBytes2 = new TextEncoder().encode(secret2);
            const identity2 = new Identity(secretBytes2);

            // Create a group with the identity elements
            const group = new Group([
                identity.toElement(),
                identity2.toElement(),
            ]);

            // Generate semaphore proof
            const message = "message";
            const scope = "scope";
            const treeDepth = 20;

            const proof = await generateSemaphoreProof(
                identity,
                group,
                message,
                scope,
                treeDepth
            );

            console.log("Generated proof:", proof);

            // Verify the proof
            const isValid = await verifySemaphoreProof(proof);
            console.log("Proof verification result:", isValid);

            setProofInfo(
                `Proof generated successfully!\nMessage: ${message}\nScope: ${scope}\nTree Depth: ${treeDepth}\nProof: ${proof.substring(0, 100)}...\nVerification: ${isValid ? "Valid" : "Invalid"}`
            );

            Alert.alert(
                "Success",
                "Proof generated and verified successfully!"
            );
        } catch (error) {
            console.error("Error generating proof:", error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            Alert.alert("Error", `Failed to generate proof: ${errorMessage}`);
            setProofInfo(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const clearIdentity = () => {
        setIdentity(null);
        setIdentityInfo("");
        setGroupInfo("");
        setProofInfo("");
    };

    const testGroup = async () => {
        try {
            setIsLoading(true);

            // Create identities for testing
            const secret = "secret";
            const secret2 = "secret2";
            const secretBytes = new TextEncoder().encode(secret);
            const secretBytes2 = new TextEncoder().encode(secret2);
            const identity = new Identity(secretBytes);
            const identity2 = new Identity(secretBytes2);

            // Create a group with the identity elements
            const group = new Group([
                identity.toElement(),
                identity2.toElement(),
            ]);

            // Get the root
            const root = group.root();
            console.log("Group root:", root);

            // Get additional group information
            const depth = group.depth();
            const members = group.members();

            setGroupInfo(
                `Group created successfully!\nGroup Depth: ${depth}\nGroup Root: ${root}\nNumber of Members: ${members.length}`
            );

            Alert.alert("Success", "Group test completed successfully!");
        } catch (error) {
            console.error("Error testing group:", error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            Alert.alert(
                "Error",
                `Failed to test group functionality: ${errorMessage}`
            );
            setGroupInfo(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Semaphore Identity</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Identity Management</Text>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[
                                styles.button,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={initIdentity}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading
                                    ? "Initializing..."
                                    : "Initialize Identity"}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                styles.groupButton,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={testGroup}
                            disabled={isLoading}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? "Testing..." : "Test Group"}
                            </Text>
                        </Pressable>

                        {identity && (
                            <Pressable
                                style={[
                                    styles.button,
                                    styles.proofButton,
                                    isLoading && styles.buttonDisabled,
                                ]}
                                onPress={generateProof}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading
                                        ? "Generating..."
                                        : "Generate Proof"}
                                </Text>
                            </Pressable>
                        )}

                        {identity && (
                            <Pressable
                                style={[styles.button, styles.clearButton]}
                                onPress={clearIdentity}
                            >
                                <Text style={styles.buttonText}>
                                    Clear Identity
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {identity && (
                        <View style={styles.identityContainer}>
                            <Text style={styles.identityTitle}>
                                Current Identity
                            </Text>
                            <View style={styles.identityInfo}>
                                <Text style={styles.identityText}>
                                    {identityInfo}
                                </Text>
                            </View>
                        </View>
                    )}

                    {groupInfo && (
                        <View style={styles.identityContainer}>
                            <Text style={styles.identityTitle}>
                                Group Information
                            </Text>
                            <View style={styles.identityInfo}>
                                <Text style={styles.identityText}>
                                    {groupInfo}
                                </Text>
                            </View>
                        </View>
                    )}

                    {proofInfo && (
                        <View style={styles.identityContainer}>
                            <Text style={styles.identityTitle}>
                                Proof Information
                            </Text>
                            <View style={styles.identityInfo}>
                                <Text style={styles.identityText}>
                                    {proofInfo}
                                </Text>
                            </View>
                        </View>
                    )}

                    {!identity && !groupInfo && !proofInfo && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                No identity or group initialized. Click the
                                buttons above to create one.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    scrollView: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    buttonContainer: {
        gap: 15,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: "#999",
    },
    clearButton: {
        backgroundColor: "#FF3B30",
    },
    groupButton: {
        backgroundColor: "#34C759",
    },
    proofButton: {
        backgroundColor: "#FF9500",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    identityContainer: {
        backgroundColor: "#F2F2F7",
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    identityTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    identityInfo: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 12,
    },
    identityText: {
        fontSize: 12,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        lineHeight: 18,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        textAlign: "center",
        color: "#8E8E93",
        fontStyle: "italic",
    },
});
