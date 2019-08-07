import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native";

const oddRowColor = "white";
const evenRowColor = "#f2f5f7";

export default class Leaderboard extends Component {
  state = {
    sortedData: [],
    prevData: null
  };

  static propTypes = {
    ...ViewPropTypes,
    //required
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sortBy: PropTypes.string.isRequired,
    labelBy: PropTypes.string.isRequired,

    //optional
    sort: PropTypes.func,
    icon: PropTypes.string,
    onRowPress: PropTypes.func,
    renderItem: PropTypes.func,
    containerStyle: PropTypes.object,
    scoreStyle: PropTypes.object,
    rankStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    avatarStyle: PropTypes.object,
    oddRowColor: PropTypes.string,
    evenRowColor: PropTypes.string
  };

  defaultRenderItem = (item, index) => {
    const sortBy = this.props.sortBy;
    const evenColor = this.props.evenRowColor || evenRowColor;
    const oddColor = this.props.oddRowColor || oddRowColor;
    const rowColor = index % 2 === 0 ? evenColor : oddColor;

    const rowJSx = (
      <View style={[styles.row, { backgroundColor: rowColor }]}>
        <View style={styles.left}>
          <Text
            style={[
              styles.rank,
              this.props.rankStyle,
              index < 9 ? styles.singleDidget : styles.doubleDidget
            ]}
          >
            {parseInt(index) + 1}
          </Text>
          {this.props.icon && (
            <Image
              source={{ uri: item[this.props.icon] }}
              style={[styles.avatar, this.props.avatarStyle]}
            />
          )}
          <Text style={[styles.label, this.props.labelStyle]} numberOfLines={1}>
            {item[this.props.labelBy]}
          </Text>
        </View>
        <Text style={[styles.score, this.props.scoreStyle]}>
          {item[sortBy] || 0}
        </Text>
      </View>
    );

    return this.props.onRowPress ? (
      <TouchableOpacity onPress={() => this.props.onRowPress(item, index)}>
        {rowJSx}
      </TouchableOpacity>
    ) : (
      rowJSx
    );
  };

  renderItem = ({ item, index }) => {
    return this.props.renderItem
      ? this.props.renderItem(item, index)
      : this.defaultRenderItem(item, index);
  };

  componentDidMount() {
    const { data, sortBy, sort } = this.props;
    this.setState({ sortedData: _sort(data, sortBy, sort) });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.prevData !== nextProps.data) {
      return {
        sortedData: _sort(nextProps.data, nextProps.sortBy, nextProps.sort),
        prevData: nextProps.data
      };
    } else {
      return {};
    }
  }

  render() {
    const { sortedData } = this.state;

    return (
      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={data => this.renderItem(data)}
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#d6d7da"
  },
  left: {
    flexDirection: "row",
    alignItems: "center"
  },
  rank: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 5
  },
  singleDidget: {
    paddingLeft: 16,
    paddingRight: 6
  },
  doubleDidget: {
    paddingLeft: 10,
    paddingRight: 2
  },
  label: {
    fontSize: 17,
    flex: 1,
    paddingRight: 80
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    right: 15,
    paddingLeft: 15
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    marginRight: 10
  }
});

_sort = (data, sortBy, sort) => {
  if (sort) {
    return sort(data);
  } else if (typeof data === "object") {
    let sortedKeys =
      data &&
      Object.keys(data).sort((key1, key2) => {
        return data[key2][sortBy] - data[key1][sortBy];
      });
    return (
      sortedKeys &&
      sortedKeys.map(key => {
        return data[key];
      })
    );
  } else if (typeof data === "array") {
    return (
      data &&
      data.sort((item1, item2) => {
        return item2[sortBy] - item1[sortBy];
      })
    );
  }
};
