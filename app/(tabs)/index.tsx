import { Button, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useState } from "react";
import Spending from "../../components/spendings";
import { TextInput } from "react-native-gesture-handler";

interface Spending {
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
  const [spendings, setSpendings] = useState<Spending[]>(
    defaultProps as Spending[]
  );
  const [formData, setFormData] = useState<FormDataI>({} as FormDataI);

  const handleInputChange = (name: formDataField, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const newSpending = {
      name: formData.name,
      amount: Number(formData.amount),
      currency: formData.currency,
      date: new Date(),
    };
    if (!newSpending.currency) {
      newSpending.currency = defaultCurrency;
    }
    setSpendings([...spendings, newSpending]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {spendings.map((spen, i) => (
          <Spending
            key={i}
            name={spen.name}
            amount={spen.amount}
            currency={spen.currency}
            deleteCallback={() => {
              const newSpendings = spendings.filter((_, index) => index !== i);
              setSpendings(newSpendings);
            }}
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

const defaultProps = [
  {
    name: "Macaroons",
    amount: 190,
    currency: "KGS",
    date: new Date(),
  },
  {
    name: "Tereza",
    amount: 54500,
    currency: "KGS",
    date: new Date(),
  },
  {
    name: "AUCA",
    amount: 6550,
    currency: "USD",
    date: new Date(),
  },
];
