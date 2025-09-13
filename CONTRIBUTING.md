# Contributing to YAAI Platform

Спасибо за интерес к участию в развитии YAAI Platform! Этот документ содержит руководство по участию в проекте.

## 🤝 Как участвовать

### Способы участия

1. **Reporting Issues** - Сообщение об ошибках и предложения улучшений
2. **Code Contributions** - Разработка новых функций и исправление ошибок
3. **Documentation** - Улучшение документации
4. **Testing** - Тестирование и QA
5. **Community Support** - Помощь другим участникам

## 🐛 Сообщение об ошибках

### Перед созданием issue

1. Убедитесь, что ошибка не была уже сообщена
2. Проверьте, что используете последнюю версию
3. Попробуйте воспроизвести ошибку в чистом окружении

### Шаблон для bug report

```markdown
**Описание ошибки**
Краткое описание проблемы.

**Шаги для воспроизведения**
1. Перейти к '...'
2. Нажать на '...'
3. Прокрутить вниз до '...'
4. Увидеть ошибку

**Ожидаемое поведение**
Описание того, что должно было произойти.

**Скриншоты**
Если применимо, добавьте скриншоты.

**Окружение:**
- OS: [например, Ubuntu 22.04]
- Browser: [например, Chrome 91]
- Version: [например, 1.2.3]

**Дополнительная информация**
Любая другая полезная информация.
```

## 💻 Разработка

### Настройка окружения

1. **Fork** репозитория
2. **Clone** вашего fork
3. **Установите зависимости**:
   ```bash
   npm install
   ```
4. **Создайте ветку** для вашей фичи:
   ```bash
   git checkout -b feature/amazing-feature
   ```

### Стандарты кода

#### TypeScript/JavaScript

- Используйте TypeScript для всего нового кода
- Следуйте ESLint конфигурации проекта
- Используйте Prettier для форматирования
- Покрытие тестами должно быть не менее 80%

```typescript
// ✅ Хорошо
interface User {
  id: string;
  email: string;
  name: string;
}

const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  // implementation
};

// ❌ Плохо
const createUser = (userData: any) => {
  // implementation
};
```

#### React Components

- Используйте функциональные компоненты с hooks
- Следуйте принципам composition over inheritance
- Используйте TypeScript для props

```typescript
// ✅ Хорошо
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{campaign.name}</Typography>
        <Button onClick={() => onEdit(campaign.id)}>Edit</Button>
        <Button onClick={() => onDelete(campaign.id)}>Delete</Button>
      </CardContent>
    </Card>
  );
};
```

#### Backend Services

- Используйте Express.js с TypeScript
- Следуйте RESTful API принципам
- Используйте Joi для валидации
- Обрабатывайте ошибки корректно

```typescript
// ✅ Хорошо
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createCampaignSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  type: Joi.string().valid('SEARCH', 'DISPLAY', 'MOBILE').required(),
  budget: Joi.number().positive().required()
});

export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = createCampaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const campaign = await campaignService.create(value);
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};
```

### Git Workflow

#### Commit Messages

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: новая функция
- `fix`: исправление ошибки
- `docs`: изменения в документации
- `style`: форматирование, отсутствие изменений в коде
- `refactor`: рефакторинг кода
- `test`: добавление тестов
- `chore`: обновление зависимостей, конфигурации

**Примеры:**
```
feat(campaigns): add campaign duplication feature
fix(api): resolve authentication token expiration issue
docs(readme): update installation instructions
test(campaigns): add unit tests for campaign service
```

#### Pull Request Process

1. **Обновите вашу ветку** с main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/amazing-feature
   git rebase main
   ```

2. **Запустите тесты**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

3. **Создайте Pull Request** с описанием:
   - Что изменено
   - Почему изменено
   - Как тестировать
   - Скриншоты (если применимо)

4. **Дождитесь review** от maintainers

### Тестирование

#### Unit Tests

```typescript
// campaign.service.test.ts
describe('CampaignService', () => {
  let service: CampaignService;
  
  beforeEach(() => {
    service = new CampaignService();
  });

  describe('createCampaign', () => {
    it('should create campaign with valid data', async () => {
      const campaignData = {
        name: 'Test Campaign',
        type: 'SEARCH',
        budget: 10000
      };

      const result = await service.create(campaignData);

      expect(result).toBeDefined();
      expect(result.name).toBe(campaignData.name);
      expect(result.id).toBeDefined();
    });

    it('should throw error with invalid data', async () => {
      const invalidData = {
        name: '',
        type: 'INVALID',
        budget: -100
      };

      await expect(service.create(invalidData)).rejects.toThrow();
    });
  });
});
```

#### Integration Tests

```typescript
// campaign.integration.test.ts
describe('Campaign API', () => {
  let app: Application;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    token = await getAuthToken();
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  describe('POST /api/campaigns', () => {
    it('should create campaign', async () => {
      const campaignData = {
        name: 'Integration Test Campaign',
        type: 'SEARCH',
        budget: 5000
      };

      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${token}`)
        .send(campaignData)
        .expect(201);

      expect(response.body.name).toBe(campaignData.name);
    });
  });
});
```

#### E2E Tests

```typescript
// campaign.e2e.test.ts
describe('Campaign Management', () => {
  let page: Page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3100');
    await login(page);
  });

  it('should create new campaign', async () => {
    await page.click('[data-testid="create-campaign-button"]');
    await page.fill('[data-testid="campaign-name"]', 'E2E Test Campaign');
    await page.selectOption('[data-testid="campaign-type"]', 'SEARCH');
    await page.fill('[data-testid="campaign-budget"]', '1000');
    await page.click('[data-testid="save-campaign-button"]');

    await expect(page.locator('[data-testid="campaign-list"]')).toContainText('E2E Test Campaign');
  });
});
```

## 📚 Документация

### Типы документации

1. **API Documentation** - автогенерируется из OpenAPI спецификации
2. **User Guide** - руководства для пользователей
3. **Developer Guide** - техническая документация для разработчиков
4. **Architecture Documentation** - описание архитектуры системы

### Стандарты документации

- Используйте Markdown для всей документации
- Включайте примеры кода
- Обновляйте документацию при изменении API
- Используйте четкие заголовки и структуру

## 🎨 Design System

### UI Components

- Используйте Material-UI как базовую библиотеку
- Создавайте переиспользуемые компоненты
- Следуйте принципам accessibility (a11y)
- Поддерживайте темную и светлую темы

### Цветовая схема

```typescript
const theme = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1'
};
```

## 🔒 Безопасность

### Reporting Security Issues

**НЕ создавайте публичные issues для уязвимостей безопасности!**

Отправьте email на security@yaai.platform с описанием:
- Описание уязвимости
- Шаги для воспроизведения
- Потенциальное влияние
- Предлагаемое решение (если есть)

### Security Checklist

- [ ] Валидация всех входных данных
- [ ] Защита от SQL injection
- [ ] Защита от XSS
- [ ] Правильная аутентификация и авторизация
- [ ] Шифрование чувствительных данных
- [ ] Безопасные HTTP заголовки
- [ ] Rate limiting
- [ ] Логирование security событий

## 📋 Code Review Guidelines

### Для авторов PR

- Создавайте небольшие, сфокусированные PR
- Пишите понятные commit messages
- Включайте тесты для нового кода
- Обновляйте документацию при необходимости
- Проверьте, что CI проходит успешно

### Для reviewers

- Будьте конструктивными и уважительными
- Фокусируйтесь на коде, а не на авторе
- Объясняйте свои комментарии
- Предлагайте альтернативы
- Одобряйте PR, если нет критических замечаний

### Review Checklist

- [ ] Код соответствует стандартам проекта
- [ ] Есть достаточное покрытие тестами
- [ ] Производительность не ухудшилась
- [ ] Безопасность учтена
- [ ] Документация обновлена
- [ ] Нет breaking changes (или они документированы)

## 🏷️ Release Process

### Versioning

Проект использует [Semantic Versioning](https://semver.org/):
- **MAJOR**: breaking changes
- **MINOR**: новые функции (backward compatible)
- **PATCH**: bug fixes

### Release Checklist

1. [ ] Все тесты проходят
2. [ ] Документация обновлена
3. [ ] CHANGELOG.md обновлен
4. [ ] Version bump в package.json
5. [ ] Git tag создан
6. [ ] Release notes написаны
7. [ ] Docker images собраны и опубликованы

## 🎯 Roadmap

### Current Focus Areas

1. **Core Platform** - Основная функциональность управления кампаниями
2. **AI Integration** - Машинное обучение и автоматизация
3. **Performance** - Оптимизация производительности
4. **Mobile App** - Мобильное приложение
5. **Enterprise Features** - Функции для крупных клиентов

### How to Get Involved

1. Проверьте [Issues](https://github.com/your-org/yaai-platform/issues) с лейблом `good first issue`
2. Присоединяйтесь к [Discord сообществу](https://discord.gg/yaai)
3. Участвуйте в [обсуждениях](https://github.com/your-org/yaai-platform/discussions)
4. Подписывайтесь на [newsletter](https://yaai.platform/newsletter)

## 📞 Связь

- **Discord**: https://discord.gg/yaai
- **Email**: dev@yaai.platform
- **Twitter**: @yaai_platform
- **Discussions**: https://github.com/your-org/yaai-platform/discussions

## 📄 License

Участвуя в проекте, вы соглашаетесь на то, что ваш вклад будет лицензирован под [MIT License](LICENSE).

---

**Спасибо за ваш вклад в YAAI Platform! 🚀**