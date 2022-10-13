import IController from "../IController/IController.js";
import UserModel from "../../Models/UserModel/UserModel.js";
import { IUserSignUp } from "../../Models/UserModel/UserModel.js"
import SignupView from "../../Views/SignupView/SignupView.js";
import { IValidatedData } from "../../Views/SigninView/SigninView.js";
import emailValidator from "../../Utils/Validators/EmailValidator/EmailValidator.js";
import firstNameValidator from "../../Utils/Validators/FirstNameValidator/FirstNameValidator.js";
import lastNameValidator from "../../Utils/Validators/LastNameValidator/LastNameValidator.js";
import nicknameValidator from "../../Utils/Validators/NicknameValidator/NicknamaValidator.js";
import passwordValidator from "../../Utils/Validators/PasswordValidator/PasswordValidator.js";
import router from "../../Router/Router.js";

export default class SignupController extends IController<SignupView, UserModel> {
    constructor(view: SignupView, model: UserModel) {
        super(view, model);
        this.view.bindSubmit(this.onSubmit.bind(this));
        this.view.bindRedirect(this.onRedirect.bind(this));
    }

    private onRedirect(href: string) {
        router.goToPath(href);
    }

    private onSubmit(data: Map<string, string>): void {
        const { isValidData, validatedData } = this.validate(data);
        this.view.showErrors(validatedData);
        if (!isValidData) {
            console.log('invalid data');
            return;
        }

        console.log('valid data');

        const user: IUserSignUp = {
            first_name: data.get('first_name') || '',
            last_name: data.get('last_name') || '',
            nick_name: data.get('nick_name') || '',
            email: data.get('email') || '',
            password: data.get('password') || ''
        };

        this.model.registerUser(user).then(({ status, body }) => {
            console.log('reg success');
        }).catch(({ status, body }) => {
            console.log('reg failure');
            switch (status) {
                // case 401:
                // case 404: {
                //     this.view.showError('email', { isValid: false, msg: 'Неверный email или пароль' });
                //     break;
                // }
                default: {
                    this.view.showError('email', { isValid: false, msg: `Ошибка сервера ${status}` });
                    break;
                }
            }
        });

    }

    private validate(data: Map<string, string>): {
        isValidData: boolean,
        validatedData: Map<string, IValidatedData>
    } {
        let isValidData = true;
        const validatedData = new Map<string, IValidatedData>;

        data.forEach((value, id) => {
            switch (id) {
                case 'first_name': {
                    const { isValid, msg } = firstNameValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'last_name': {
                    const { isValid, msg } = lastNameValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'nick_name': {
                    const { isValid, msg } = nicknameValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'email': {
                    const { isValid, msg } = emailValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'password': {
                    const { isValid, msg } = passwordValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'email': {
                    const { isValid, msg } = emailValidator(value);
                    validatedData.set(id, { isValid, msg });
                    if (!isValid) { isValidData = false; }
                    break;
                }
                case 'repeat_password': {
                    if (value !== data.get('password')) {
                        validatedData.set(id, { isValid: false, msg: 'Пароли должны совпадать' });
                    } else {
                        validatedData.set(id, { isValid: true, msg: '' });
                    }
                    break;
                }

                default: {
                    validatedData.set(id, { isValid: true, msg: '' });
                    break;
                }
            }
        });

        return { isValidData, validatedData };
    }
}