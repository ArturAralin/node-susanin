const { GET } = require('../../methods');

const setToPropsSymbol = {};
const middlewaresPropsSymbol = {};
let firstCallProps = null;

const setToPropsMiddleware = ({
  setToProps,
  pass,
  props,
}) => {
  // This for next test
  if (firstCallProps === null) {
    firstCallProps = props;
  }

  setToProps('testProp', setToPropsSymbol);

  pass();
};

const setToPropsCtrl = ({
  reply,
  props,
}) => {
  const isSetToPropsWorks = props.testProp === setToPropsSymbol;
  const isTheSameWithMiddlewresProps = props.testProp === setToPropsSymbol;
  const isPropsNotEqualsPreviousPropsObject = firstCallProps === props;

  reply({
    isSetToPropsWorks,
    isTheSameWithMiddlewresProps,
    isPropsNotEqualsPreviousPropsObject,
  });
};

module.exports = [
  {
    method: GET,
    path: '/middlewares/params/set-to-props',
    controller: setToPropsCtrl,
    middlewares: [setToPropsMiddleware],
    validation: {},
    middlewaresProps: {
      middlewaresPropsSymbol,
    },
  },
];
