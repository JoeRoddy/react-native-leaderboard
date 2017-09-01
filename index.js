import React, { Component, PropTypes } from 'react';
import {
    View, Text, ListView, ViewPropTypes,
    Image, TouchableOpacity, StyleSheet
} from 'react-native';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const oddRowColor = "white";
const evenRowColor = "#f2f5f7";

export default class Leaderboard extends Component {
    static propTypes = {
        ...ViewPropTypes,
        //required
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        filterBy: PropTypes.string.isRequired,
        labelBy: PropTypes.string.isRequired,

        //optional
        filter: PropTypes.func,
        icon: PropTypes.string,
        onRowPress: PropTypes.func,
        renderItem: PropTypes.func,
        containerStyle: PropTypes.object,
        scoreStyle: PropTypes.object,
        rankStyle: PropTypes.object,
        labelStyle: PropTypes.object,
        avatarStyle: PropTypes.object,
        oddRowColor: PropTypes.string,
        evenRowColor: PropTypes.string,
    }

    _filter = (data) => {
        const filterBy = this.props.filterBy;

        let filtered = [];
        if (this.props.filter) {
            return this.props.filter(data);
        } else if (typeof data === 'object') {
            let sortedKeys = data && Object.keys(data).sort((key1, key2) => {
                return data[key2][filterBy] - data[key1][filterBy];
            })
            return sortedKeys && sortedKeys.map(key => {
                return data[key];
            })
        } else if (typeof data === 'array') {
            return data && data.sort((item1, item2) => {
                return item2[filterBy] - item1[filterBy];
            })
        }
    }

    _defaultRenderItem = (item, index) => {
        const filterBy = this.props.filterBy;
        const evenColor = this.props.evenRowColor || evenRowColor;
        const oddColor = this.props.oddRowColor || oddRowColor;

        const rowColor = index % 2 === 0 ?
            evenColor : oddColor;

        const rowJSx = (
            <View style={[styles.row, { backgroundColor: rowColor }]}
                key={index}>
                <View style={styles.left}>
                    <Text style={[styles.rank, this.props.rankStyle, index < 9 ?
                        styles.singleDidget : styles.doubleDidget]}>
                        {parseInt(index) + 1}
                    </Text>
                    {this.props.icon &&
                        <Image source={{ uri: item[this.props.icon] }}
                            style={[styles.avatar, this.props.avatarStyle]} />
                    }
                    <Text style={[styles.label, this.props.labelStyle]}
                        numberOfLines={1}>
                        {item[this.props.labelBy]}
                    </Text>
                </View>
                <Text style={[styles.score,
                this.props.scoreStyle]}>
                    {item[filterBy] || 0}
                </Text>
            </View>
        );

        return this.props.onRowPress ?
            (<TouchableOpacity onPress={e => this.props.onRowPress(item, index)}>
                {rowJSx}
            </TouchableOpacity>)
            : rowJSx;
    }

    _renderItem = (item, index) => {
        return this.props.renderItem ? this.props.renderItem(item, index)
            : this._defaultRenderItem(item, index);
    }

    render() {
        const filteredData = this._filter(this.props.data);
        const dataSource = ds.cloneWithRows(filteredData);

        return (
            <ListView
                style={this.props.containerStyle}
                dataSource={dataSource}
                renderRow={(data, someShit, i) => this._renderItem(data, i)}
            />
        )
    }
}

const styles = StyleSheet.create({
    row: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: .5,
        borderRadius: 5,
        borderColor: '#d6d7da',
    },
    left: {
        flexDirection: 'row',
    },
    rank: {
        fontSize: 26,
        fontWeight: 'bold',
        marginRight: 5,
    },
    singleDidget: {
        paddingLeft: 16,
        paddingRight: 6
    },
    doubleDidget: {
        paddingLeft: 5,
    },
    label: {
        fontSize: 26,
        flex: 1,
        paddingRight: 80,
    },
    score: {
        fontSize: 30,
        fontWeight: 'bold',
        position: 'absolute',
        right: 15,
        paddingLeft: 15,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        marginRight: 10
    },
});
