import { Button, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";

import { useSpendingStore } from "../../store/store";
import { Currency, Spending as SpendingI } from "../../models/spendings";
import Spending from "../../components/spendings";
import { Text, View } from "../../components/Themed";

type formDataField = "name" | "amount" | "currency";

interface FormDataI {
  name: string;
  amount: string;
  currency?: Currency;
}

const defaultCurrency = "KGS";

export default function TabOneScreen() {
  const db: SQLite.SQLiteDatabase = SQLite.openDatabase("spendings.db");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS spendings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, currency TEXT, date TEXT);"
      );
    });

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM spendings;", [], (_, { rows }) => {
        const spendings = rows._array as SpendingI[];
        spendingsStore.setSpendings(spendings);
        const sum = spendings.reduce((acc, curr) => acc + curr.amount, 0);
      });
    });
  }, []);

  const spendingsStore = useSpendingStore();
  const [formData, setFormData] = useState<FormDataI>({} as FormDataI);

  const handleInputChange = (name: formDataField, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const newSpending = {
      id: 0,
      name: formData.name,
      amount: Number(formData.amount),
      currency: formData.currency,
      date: new Date(),
    } as SpendingI;
    if (!newSpending.currency) {
      newSpending.currency = defaultCurrency;
    }
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO spendings (name, amount, currency, date) VALUES (?, ?, ?, ?);",
          [
            newSpending.name,
            newSpending.amount,
            newSpending.currency || defaultCurrency,
            newSpending.date.toISOString(),
          ],
          (_, { insertId }) => {
            newSpending.id = insertId as number;
          }
        );
      },
      (err) => console.log(err),
      () => {
        setFormData({} as FormDataI);
        spendingsStore.addSpending(newSpending);
      }
    );
  };

  const handleDelete = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM spendings WHERE id = ?;", [id]);
    });

    spendingsStore.deleteSpending(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total: {spendingsStore.spendingsTotal}</Text>

      <ScrollView style={styles.scrollView}>
        {spendingsStore.spendings.map((spen, i) => (
          <Spending
            key={i}
            spending={spen}
            deleteCallback={() => handleDelete(spen.id)}
          />
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("name", text)}
        value={formData.name}
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("amount", text)}
        value={formData.amount}
        keyboardType='numeric'
      />

      <Button title='Submit' onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "white",
  },
  scrollView: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    height: 40,
    width: "90%",
    borderRadius: 10,
    borderColor: "gray",
    margin: 12,
    borderWidth: 1,
  },
});
