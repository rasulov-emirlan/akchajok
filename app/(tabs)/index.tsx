import { Button, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import Spending from "../../components/spendings";
import { TextInput } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";

interface Spending {
  id: number;
  name: string;
  amount: number;
  currency?: currency;
  date: Date;
}

interface FormDataI {
  name: string;
  amount: string;
  currency?: currency;
}

type currency = "KGS" | "USD" | "EUR" | "RUB";

const defaultCurrency: currency = "KGS";

type formDataField = "name" | "amount" | "currency";

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
        setSpendings([]);
        for (let i = 0; i < rows.length; i++) {
          setSpendings((prev) => [
            ...prev,
            {
              id: rows.item(i).id,
              name: rows.item(i).name,
              amount: rows.item(i).amount,
              currency: rows.item(i).currency,
              date: new Date(rows.item(i).date),
            },
          ]);
        }
      });
    });
  }, []);

  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [spendingSum, setSpendingSum] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataI>({} as FormDataI);

  useEffect(() => {
    let sum = 0;
    spendings.forEach((spen) => {
      sum += spen.amount;
    });
    setSpendingSum(sum);
  }, [spendings]);

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
    };
    if (!newSpending.currency) {
      newSpending.currency = defaultCurrency;
    }
    db.transaction((tx) => {
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
    });
    setSpendings([...spendings, newSpending]);
  };

  const handleDelete = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM spendings WHERE id = ?;", [id]);
    });

    const newSpendings = spendings.filter((spen) => spen.id !== id);
    setSpendings(newSpendings);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total: {spendingSum}</Text>

      <ScrollView style={styles.scrollView}>
        {spendings.map((spen, i) => (
          <Spending
            key={i}
            name={spen.name}
            amount={spen.amount}
            currency={spen.currency}
            deleteCallback={() => handleDelete(spen.id)}
            date={spen.date}
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
    backgroundColor: "white"
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
