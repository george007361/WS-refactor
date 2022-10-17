const source = `
<div class="header__item__profile" id="header__item__profile" href="{{href_profile}}">
    <img src="{{user_avatar}}" alt="" class="header__item__profile__avatar">
    <div class="header__item__profile__name">{{user_name}}</div>
</div>
<div class="header__item__settings" id="header__item__settings" href="{{href_settings}}">
    <img src="{{settings_icon}}" alt="" class="header__item__settings__icon">
</div>
`;
const headerProfileTemplate = Handlebars.compile(source);
export default headerProfileTemplate;
