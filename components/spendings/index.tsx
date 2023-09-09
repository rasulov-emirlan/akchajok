import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Spending as SpendingI } from "../../models/spendings";

interface Props {
  spending: SpendingI;
  deleteCallback: () => void;
}

export default function Spending(props: Props): JSX.Element {
  const [opened, setOpened] = React.useState<boolean>(false);

  return (
    <View style={styles.shadowView}>
      <View style={styles.container}>
        <Text onPress={(e) => setOpened((prev) => !prev)} style={styles.name}>
          {props.spending.name}
        </Text>
        <View>
          <Text style={styles.amount}>{props.spending.amount}</Text>
          <Text style={styles.currency}>{props.spending.currency}</Text>
        </View>
      </View>

      {/* when opened show a button which can delete */}

      {opened && (
        <Button
          color={"red"}
          title='delete'
          onPress={(e) => {
            props.deleteCallback();
            setOpened(false);
          }}></Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowView: {
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Adjust this value for the desired shadow effect
  },
  container: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  currency: {
    fontSize: 15,
    fontWeight: "bold",
    color: "green",
    textTransform: "uppercase",
    textAlign: "right",
  },
  delete: {
    fontSize: 15,
    color: "red",
  },
});
