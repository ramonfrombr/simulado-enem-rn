import { SafeAreaView, StatusBar, Image, View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native'
import React, {useEffect, useState} from 'react'
import { COLORS, SIZES } from '../constants';
import data from '../data/QuizData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components';
import Markdown from 'react-native-markdown-display';


const Quiz = () => {

    const allQuestions = data;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false)
    const [score, setScore] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [showCorrect, setShowCorrect] = useState(false);
    const [answers, setAnswers] = useState([])

    const [progress, setProgress] = useState(new Animated.Value(0));


    const progressAnim = progress.interpolate({
        inputRange: [0, allQuestions.length],
        outputRange: ['0%', "100%"]
    });


    useEffect(() => {
        console.log("************* ANSWERS");
        console.log(answers);
    }, [answers])

    useEffect(() => {
        console.log("************* SCORE");
        console.log(score);
    }, [score])


    const selectAnswer = (selectedOption, questionId) => {

        answersCopy = [...answers]

        setCurrentOptionSelected(selectedOption);

        // Check if question was already answered
        for (let e of answersCopy) {

            if (e.question_id==questionId) {
                
                e.answer = selectedOption;
                setAnswers(answersCopy);
                return;
            }
        }

        // Register new question
        setAnswers([...answers, {"question_id": questionId, "answer": selectedOption}])
    };

    const calculateScore = () => {

        let temporaryScore = 0

        for (let answer of answers) {

            let question = allQuestions.find(question => question.id == answer.question_id)

            if (question.correct_option==answer.answer) temporaryScore++;
        }

        setScore(temporaryScore);
    };



    /*
    const validateAnswer = (selectedOption) => {

        console.log("************OPTION SELECTED")
        console.log(selectedOption)

        let correct_option = allQuestions[currentQuestionIndex]['correct_option'];

        setCorrectOption(correct_option);
        setCurrentOptionSelected(selectedOption);
        setIsOptionsDisabled(true);
 
        if(correct_option==selectedOption) {
            setScore(score+1);
        }

        //Show next button
        setShowNextButton(true);
    };*/

    const handleNext = () => {
        if(currentQuestionIndex==allQuestions.length-1) {
            // Last question
            
            // Evaluates answers
            calculateScore();

            // Show Score Modal
            setShowScoreModal(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex+1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }

        Animated.timing(progress, {
            toValue: currentQuestionIndex+1,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    const restartQuiz = () => {
        setShowScoreModal(false);
        
        setCurrentQuestionIndex(0);
        setScore(0);

        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        setShowNextButton(false);

        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    const renderProgressBar = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: '#00000020'
                }}
            >
                <Animated.View
                    style={[{
                        height: 20,
                        borderRadius: 20,
                        backgroundColor: COLORS.accent
                    }, {
                        width: progressAnim
                    }]}
                >

                </Animated.View>
            </View>
        )
    };

    const renderQuestion = () => {
        return (
            <View>

                {/* Question Counter */}
                <View style={styles.questionHeader}>
                    <Text style={styles.questionCounter}>{currentQuestionIndex+1}</Text>
                    <Text style={styles.questionTotal}>/ {allQuestions.length}</Text>
                </View>

                {/* Question */}

                <Markdown
                    style={{
                        body: {fontSize: 20},
                      }}
                >
                    {allQuestions[currentQuestionIndex]?.question}
                </Markdown>

        </View>
        )
    };

    const renderOptions = () => {

        const letras = ['a', 'b', 'c', 'd', 'e']

        return (
            <View
                style={{marginTop: 20}}
            >
                {allQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    
                    <View
                        key={option}
                        style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%'}}
                    >
                        <View
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor:'black', color: 'white', borderRadius: '50%', width: 20, height: 20, marginRight: 8}}
                        >
                            <Text style={{  color: 'white'}}>{letras[index]}</Text>
                        </View>
                    
                        <OptionContainer
                            option={option}
                            correctOption={correctOption}
                            currentOptionSelected={currentOptionSelected}
                            showCorrect={showCorrect}
                            onPress={() => selectAnswer(option, allQuestions[currentQuestionIndex]?.id)}
                            disabled={isOptionsDisabled}
                        >
                            <Markdown
                                style={{
                                    paragraph: {
                                        fontSize: 20
                                    }
                                }}
                            >
                                {option}
                            </Markdown>

                            {/* Show Check or Cross icon based on correct answer */}
                            {option==correctOption && showCorrect ? (
                                <View style={{...styles.questionOptionIcon, backgroundColor: COLORS.success}}>
                                    <MaterialCommunityIcons name="check" style={{color: 'white'}}/>
                                </View>
                            ) : option==currentOptionSelected && showCorrect ? (
                                <View style={{...styles.questionOptionIcon, backgroundColor: COLORS.error}}>
                                    <MaterialCommunityIcons name="close" style={{color: 'white'}} />
                                </View>
                            ) : null}
                        </OptionContainer>
                    </View>
                ))
                }
            </View>
        )
    };

    const renderNextButton = () => {
        return (
            <TouchableOpacity
                onPress={handleNext}
                style={styles.buttonNextContainer}
            >
                <Text style={styles.buttonNext}>Next</Text>
            </TouchableOpacity>
        )
        /*
        if(showNextButton) {
            return (
                <TouchableOpacity
                    onPress={handleNext}
                    style={styles.buttonNextContainer}
                >
                    <Text style={styles.buttonNext}>Next</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    style={{...styles.buttonNextContainer, visibility: 'hidden'}}
                >
                    <Text style={{...styles.buttonNext, visibility: 'hidden'}}>Next</Text>
                </TouchableOpacity>
            )
        }*/
    }

    return (
    <SafeAreaView>
        <StatusBar 
            barStyle="light-content" 
            backgroundColor={COLORS.primary}
        />
        
        <Container>
           
            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Question */}
            {renderQuestion()}

            {/* Options */}
            {renderOptions()}

            {/* Next Button */}
            {renderNextButton()}

            {/* Score Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showScoreModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalWrap}>
                        <Text
                            style={styles.modalHeader}
                        >{score > (allQuestions.length/2) ? 'Congratulations!' : 'Oops!'}</Text>

                        <View
                            style={styles.modalScoreContainer}
                        >
                            <Text>{score}</Text>
                            <Text>/{allQuestions.length}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={restartQuiz}
                            style={styles.retryButton}
                        >
                            <Text style={styles.retryButtonText}>Retry quiz</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={{marginBottom: 100}}></View>
        </Container>
    </SafeAreaView>
  )
}

const Container = styled.ScrollView`
    min-height: ${SIZES.height+'px'};
    padding: 15px 8px;
    background-color: ${COLORS.grey};
    position: relative;
`;

const OptionContainer = styled.TouchableOpacity`
    border-width: 1px;
    border-Color: ${props =>
        props.option==props.correctOption && props.showCorrect ? COLORS.success 
        : props.option==props.currentOptionSelected && props.showCorrect ? COLORS.error
        : props.option==props.currentOptionSelected ? COLORS.selected+'20'
        : COLORS.secondary+'40'
    };
    background-color: ${props => 
        props.option==props.correctOption && props.showCorrect ? COLORS.success+'20'
        : props.option==props.currentOptionSelected && props.showCorrect ? COLORS.error+'20'
        : props.option==props.currentOptionSelected ? COLORS.selected+'20'
        : COLORS.secondary+'20'
    };
    border-radius: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    margin: 10px 0px;
    position: relative;
`;


const styles = StyleSheet.create({
    imageStyle: {
        width: SIZES.width,
        height: 130,
        zIndex: -1,
        position: 'absolute',
        bottom: 45,
        left: 0,
        right: 0,
        opacity: 0.5
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    questionCounter: {
        color: COLORS.black,
        fontSize: 20,
        opacity: 0.6,
        marginRight: 2,
    },
    questionTotal: {
        color: COLORS.black,
        fontSize: 18,
        opacity: 0.6,
    },
    questionTitle: {
        color: COLORS.black,
        fontSize: 30,
    },
    questionOption: {
        fontSize: 20,
        color: COLORS.black
    },
    questionOptionIcon: {
        width: 30,
        height: 30,
        borderRadius: 30/2,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -10,
        right: -10,
    },
    buttonNext: {
        fontSize: 20,
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonNextContainer: {
        marginTop: 20,
        width: '100%',
        backgroundColor: COLORS.accent,
        padding: 20,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalWrap: {
        backgroundColor: COLORS.white,
        width: '90%',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalScoreContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 20,
    },
    retryButton: {
        backgroundColor: COLORS.accent,
        padding: 20,
        width: '100%',
        borderRadius: 20,
    },
    retryButtonText: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 20,
    }
})

export default Quiz