import { ScrollView } from 'react-native';
import Form from '../form/AppForm';
import DatePicker from '../form/DatePicker';
import { default as FormImage, default as ImageInput } from '../form/FormImage';
import Input from '../form/FormInput';
import Submit from '../form/SubmitButton';
import Text from './AppText';
import TextLink from './TextLink';

const Setup: React.FC<{
  initialValues: any;
  onSubmit: any;
  validationSchema: any;
  edit?: boolean | any;
  title?: string;
}> = ({
  initialValues,
  onSubmit,
  validationSchema,
  edit,
  title = 'Sign Up',
}) => {
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={{
        flex: 1,
        overflow: 'scroll',
        marginVertical: 20,
      }}
    >
      {!edit && (
        <Text
          style={{ fontSize: 18, textDecorationLine: 'underline' }}
          title='Sign Up'
        />
      )}
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormImage name='avatar' photoUrl={true} />
        <Input
          name='first_name'
          label='First name'
          placeholder='Enter your name'
          icon='account'
        />
        <Input
          name='last_name'
          label='Last name'
          placeholder='Enter your name'
          icon='account'
        />
        <Input
          name='username'
          label='Username'
          placeholder='Enter your username'
          icon='account'
        />
        <Input
          name='email'
          label='Email'
          placeholder='Enter your email'
          icon='email'
        />
        <Input
          name='ideaNumber'
          label='Idea number'
          placeholder='Enter your idea number'
          icon='numeric'
        />
        <Input
          name='phone_number'
          label='Phone number'
          placeholder='Enter your phone number'
          icon='phone'
        />
        <DatePicker
          name='date_of_birth'
          label='Date of birth'
          placeholder='Enter your date of birth'
          icon='calendar'
        />
        <Input
          name='gender'
          label='Gender'
          placeholder='Enter your gender'
          icon='gender-male-female'
        />
        <Input
          name='street'
          label='Street'
          placeholder='Enter your street'
          icon='map-marker'
        />
        <Input
          name='city'
          label='City'
          placeholder='Enter your city'
          icon='city'
        />
        <Input
          name='province'
          label='Province'
          placeholder='Enter your province'
          icon='map-marker'
        />
        <Input
          name='postal_code'
          label='Postal code'
          placeholder='Enter your postal code'
          icon='map-marker'
        />
        <Input
          name='country'
          label='Country'
          placeholder='Enter your country'
          icon='map-marker'
        />
        {!edit && (
          <Input
            name='password'
            label='Password'
            placeholder='Enter your password'
            icon='lock'
            secureTextEntry
          />
        )}
        <Submit title={title} />
      </Form>
      {!edit && (
        <TextLink text='I have account?' linkText='sign-in?' link='sign-in' />
      )}
    </ScrollView>
  );
};

export default Setup;
