import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const AppForm: React.FC<{
  initialValues: any;
  onSubmit: any;
  validationSchema: any;
  children: React.ReactNode;
  style?: any;
}> = ({ children, initialValues, onSubmit, validationSchema, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        style={{ overflow: 'scroll' }}
      >
        {() => <>{children}</>}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    overflow: 'scroll',
  },
});

export default AppForm;
