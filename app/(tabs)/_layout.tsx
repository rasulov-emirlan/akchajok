import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import React, { useState } from 'react';

import Colors from "../../constants/Colors";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      {({ pressed }) => (
        <FontAwesome
          size={28}
          style={{
            marginBottom: -3,
            color: isPressed ? "blue" : pressed ? "gray" : "black",
          }}
          {...props}
        />
      )}
    </Pressable>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "spendings",
          tabBarIcon: () => <TabBarIcon name="shopping-bag" />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
                style={{ marginRight: 15 }}
              />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "profile",
          tabBarIcon: () => <TabBarIcon name="user" />,
        }}
      />
    </Tabs>
  );
}
