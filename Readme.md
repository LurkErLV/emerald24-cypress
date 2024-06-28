<p align="center">
   <img alt="logo" src="https://media.licdn.com/dms/image/C4E0BAQEzqPgBTkrXPQ/company-logo_200_200/0/1630629248282/emerald_financial_group_uk_logo?e=2147483647&v=beta&t=cZMeKVUO8CbI4vgCa5eJRIUnvkjhrt02doWPjdd1ECo">
</p>
<h2 align="center">Emerald24</h2>
<hr/>
<h1 align="center">Документация Cypress проекта</h1>

### Перед началом работы с проектом, убедитесь, что у вас установлены следующие компоненты:
- Node.js (рекомендуемая версия 20.15.x или выше)
- npm или yarn пакетный менеджер
- Git

### Установка:
Для установки всех необходимых зависимостей выполните следующие шаги:

1. Клонируйте репозиторий проекта:

    ```bash
    git clone <URL репозитория>
    cd emerald24_testing
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

   или

    ```bash
    yarn install
    ```

## Структура проекта
```
/e2e # Тестовые файлы
/videos # Видео с тестов
/screenshots # Скриншоты с тестов
/fixtures # Тестовые данные
/plugins # Плагины для расширения функционала
/support # Команды и настройки поддержки
cypress.json # Конфигурационный файл Cypress
```

## Запуск тестов

Для запуска тестов используйте следующие команды:

- Запуск тестов в графическом интерфейсе:

    ```bash
    npm run cypress:open
    ```

  или

    ```bash
    yarn cypress:open
    ```

- Запуск тестов в режиме командной строки:

    ```bash
    npm run cypress:run
    ```

  или

    ```bash
    yarn cypress:run
    ```
  
## Написание тестов

Тесты пишутся в папке `cypress/e2e`. Вот пример простого теста:

```javascript
describe('Пример теста', () => {
  it('Проверка главной страницы', () => {
    cy.visit('https://example.com');
    cy.contains('Добро пожаловать').should('be.visible');
  });
});
```

## Ресурсы и ссылки

- [Официальная документация Cypress](https://docs.cypress.io)
- [Руководство по началу работы](https://docs.cypress.io/guides/getting-started/opening-the-app)
- [Репозиторий Cypress на GitHub](https://github.com/cypress-io/cypress)
- [Cypress примеры](https://github.com/cypress-io/cypress-example-recipes)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)