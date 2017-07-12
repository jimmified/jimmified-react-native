import React from 'react';
import _ from 'lodash';
import { colors } from 'utils/constants';
import IconButton from 'shared/IconButton';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native';
import AutoLink from 'react-native-autolink';

const styles = {
    question: {
        fontWeight: 'bold',
        color: colors.GRAY_DARK
    },

    withMargin: {
        marginHorizontal: 20
    },

    input: {
        marginHorizontal: 20,
        marginBottom: 20
    },
    buttonWrapper: {
        marginTop: 20,
        marginHorizontal: 20
    }
};

export default class AnswerAQuestion extends React.Component {

    static defaultProps = {
        onAnswer: _.noop
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onAddLink = this.onAddLink.bind(this);
        this.state = {
            answerText: '',
            linkText: '',
            links: [],
            inputHeight: 0
        };
    }

    onChange(event) {
        event = event.nativeEvent;
        const height = event.contentSize.height;
        const answerText = event.text;

        this.setState({
            answerText,
            inputHeight: height
        });
    }

    onAddLink() {

        if (_.isEmpty(this.state.linkText)) {
            return;
        }

        this.setState({
            links: [...this.state.links, this.state.linkText]
        });
        this.linkInput.clear();
    }

    render() {

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={{flex: 1}}>

                    <Text style={[styles.withMargin, { marginBottom: 40}]}>
                        <Text style={{color: colors.GRAY_DARK}}>Question: </Text>
                        <Text style={styles.question}>{this.props.text}</Text>
                    </Text>

                    <TextInput
                        style={[styles.input, {
                            minHeight: this.state.inputHeight + 20
                        }]}
                        onChange={this.onChange}
                        multiline={true}
                        placeholder="Write your answer here"
                    />

                    <View>

                        <View style={[styles.withMargin, { flexDirection: 'row' }]}>
                            <Text style={{ fontWeight: 'bold', color: colors.GRAY_DARK }}>Links</Text>
                        </View>

                        {_.map(this.state.links, (link) => {
                            return (
                                <View key={link} style={[styles.withMargin, { flexDirection: 'row'  }]}>
                                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                        <AutoLink text={link} linkStyle={{ justifyContent: 'center' }}/>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1}}>
                                        <IconButton onPress={() => {
                                                this.setState({
                                                    links: _.without(this.state.links, link)
                                                });
                                            }}
                                            name="ios-trash-outline"
                                            color={colors.RED}
                                            size={32}
                                            style={{ alignSelf: 'flex-end' }}
                                        />
                                    </View>
                                </View>
                            )
                        })}

                            <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                <TextInput
                                    style={[styles.input, { flexGrow: 1, height: 40 }]}
                                    onChangeText={newText => this.setState({ linkText: newText })}
                                    ref={input => this.linkInput = input}
                                    placeholder="Add a link"
                                />
                                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                                    <IconButton name="ios-add" color={colors.BLUE} size={32} onPress={this.onAddLink}/>
                                </View>
                            </View>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <Button
                            color={colors.GREEN}
                            onPress={() => {

                                if (_.isEmpty(this.state.answerText)) {
                                    return;
                                }

                                this.props.onAnswer({
                                    text: this.state.answerText,
                                    links: this.state.links,
                                    originalQuestion: this.props
                                })
                            }}
                            title="Answer"/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}