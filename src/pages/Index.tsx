import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [requestType, setRequestType] = useState('Заявка');
  const { toast } = useToast();

  const categories = [
    { name: 'Кирпич', icon: 'Boxes', count: '150+ товаров' },
    { name: 'Цемент', icon: 'Package', count: '80+ товаров' },
    { name: 'Песок', icon: 'Mountain', count: '20+ видов' },
    { name: 'Щебень', icon: 'Gem', count: '30+ видов' },
    { name: 'Блоки', icon: 'Box', count: '120+ товаров' },
    { name: 'Сухие смеси', icon: 'Package2', count: '200+ товаров' },
  ];

  const features = [
    { icon: 'TrendingDown', title: 'Цены от производителя', desc: 'Работаем напрямую без посредников' },
    { icon: 'Truck', title: 'Доставка за 24 часа', desc: 'Быстрая доставка по всему региону' },
    { icon: 'Shield', title: 'Гарантия качества', desc: 'Все материалы сертифицированы' },
    { icon: 'Users', title: 'Более 1000 клиентов', desc: 'Нам доверяют строители' },
    { icon: 'Clock', title: 'Работаем с 8:00 до 20:00', desc: 'Без выходных' },
    { icon: 'Wallet', title: 'Гибкая оплата', desc: 'Наличные, безналичные, рассрочка' },
  ];

  const promos = [
    { title: 'Скидка 15% на первый заказ', desc: 'Для новых клиентов', color: 'bg-orange-500' },
    { title: 'Бесплатная доставка от 50 000₽', desc: 'При заказе от 50 тыс. рублей', color: 'bg-blue-500' },
    { title: 'Кирпич по акции -20%', desc: 'До конца месяца', color: 'bg-red-500' },
  ];

  const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const weight = Number(formData.get('weight'));
    const transport = formData.get('transport') as string;
    
    const basePrice = 500;
    const weightPrice = weight * 5;
    const transportMultiplier = { 'gazelle': 1, 'kamaz': 1.5, 'manipulator': 2, 'dump': 1.8 }[transport] || 1;
    
    setCalculatedPrice(Math.round((basePrice + weightPrice) * transportMultiplier));
  };

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const requestData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      message: formData.get('message'),
      type: requestType
    };

    try {
      const response = await fetch('https://functions.poehali.dev/53d06962-a320-4ffe-a39d-222fd59d7137', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        toast({
          title: 'Заявка отправлена!',
          description: 'Наш менеджер свяжется с вами в течение 15 минут',
        });
        setRequestModalOpen(false);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заявку. Попробуйте позже.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive'
      });
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const requestData = {
      name: formData.get('cb-name'),
      phone: formData.get('cb-phone'),
      callback_time: formData.get('cb-time'),
      type: 'Обратный звонок'
    };

    try {
      const response = await fetch('https://functions.poehali.dev/53d06962-a320-4ffe-a39d-222fd59d7137', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        toast({
          title: 'Заявка принята!',
          description: 'Мы перезвоним вам в указанное время',
        });
        setCallbackModalOpen(false);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заявку. Попробуйте позже.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold text-gray-900">
                <span className="text-primary">НПТО</span> СтройИмперия
              </div>
              
              <nav className="hidden lg:flex items-center gap-6">
                <a href="#home" className="text-sm hover:text-primary transition-colors">Главная</a>
                <div className="relative">
                  <button 
                    onClick={() => setCatalogOpen(!catalogOpen)}
                    className="text-sm hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Каталог <Icon name="ChevronDown" size={16} />
                  </button>
                  {catalogOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 w-64 animate-fade-in">
                      {categories.map((cat) => (
                        <a key={cat.name} href="#catalog" className="block px-3 py-2 hover:bg-gray-50 rounded-md transition-colors">
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <a href="#about" className="text-sm hover:text-primary transition-colors">О компании</a>
                <a href="#promo" className="text-sm hover:text-primary transition-colors">Акции</a>
                <a href="#advantages" className="text-sm hover:text-primary transition-colors">Преимущества</a>
                <a href="#delivery" className="text-sm hover:text-primary transition-colors">Доставка</a>
                <a href="#contacts" className="text-sm hover:text-primary transition-colors">Контакты</a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <a href="https://t.me/yourcompany" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Icon name="Send" size={18} className="text-primary" />
                </a>
                <a href="https://vk.com/yourcompany" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Icon name="Share2" size={18} className="text-primary" />
                </a>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCallbackModalOpen(true)}
                className="hidden md:flex"
              >
                Заказать звонок
              </Button>
              <Button 
                size="sm"
                onClick={() => { setRequestType('Заявка'); setRequestModalOpen(true); }}
              >
                Оставить заявку
              </Button>
              <a href="tel:+79991234567" className="text-sm font-semibold hidden md:flex items-center gap-2 hover:text-primary transition-colors">
                <Icon name="Phone" size={16} />
                +7 (999) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </header>

      <section id="home" className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Строительные материалы от производителя
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Более 1000 наименований строительных материалов с доставкой по всему региону
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <Button size="lg" asChild>
                  <a href="#catalog">Перейти в каталог</a>
                </Button>
                <Button size="lg" variant="secondary" onClick={() => { setRequestType('Заявка'); setRequestModalOpen(true); }}>
                  Оставить заявку
                </Button>
                <Button size="lg" variant="outline" onClick={() => setCallbackModalOpen(true)}>
                  Заказать звонок
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚚</div>
                  <div className="text-sm text-gray-600">Доставка за 24 часа</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm text-gray-600">Цены от производителя</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm text-gray-600">Гарантия качества</div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop" 
                alt="Строительные материалы"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="promo" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Акции и спецпредложения</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {promos.map((promo, idx) => (
              <Card key={idx} className="overflow-hidden animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`h-2 ${promo.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-gray-600">{promo.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Каталог товаров</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, idx) => (
              <Card key={category.name} className="hover:shadow-lg transition-all cursor-pointer animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <CardContent className="p-6 text-center">
                  <Icon name={category.icon as any} size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">О компании</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-4">НПТО СтройИмперия</h3>
              <p className="text-gray-600 mb-4">
                Мы работаем на рынке строительных материалов с 2010 года. За это время мы стали одним из крупнейших поставщиков в регионе, обслужив более 1000 довольных клиентов.
              </p>
              <p className="text-gray-600 mb-4">
                Наша миссия — обеспечивать строителей качественными материалами по честным ценам. Работаем напрямую с производителями, что позволяет нам предлагать лучшие условия на рынке.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-gray-600">лет на рынке</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-primary">1000+</p>
                  <p className="text-sm text-gray-600">клиентов</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-primary">1000+</p>
                  <p className="text-sm text-gray-600">товаров</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-gray-600">поддержка</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop" 
                alt="О компании"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => (
              <Card key={feature.title} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardContent className="p-6">
                  <Icon name={feature.icon as any} size={40} className="text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center bg-orange-50 p-8 rounded-lg">
            <p className="text-xl mb-4">Убедились в наших преимуществах? Получите бесплатную консультацию!</p>
            <Button size="lg" onClick={() => { setRequestType('Консультация'); setRequestModalOpen(true); }}>
              Получить консультацию
            </Button>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Доставка</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-6">Быстрая доставка по всему региону</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Icon name="Truck" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Доставка за 24 часа</h4>
                    <p className="text-gray-600 text-sm">Оперативная доставка строительных материалов на ваш объект</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Доставка по всей области</h4>
                    <p className="text-gray-600 text-sm">Работаем по всей Московской области и близлежащим регионам</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Icon name="DollarSign" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Бесплатная доставка от 50 000₽</h4>
                    <p className="text-gray-600 text-sm">При заказе от 50 тысяч рублей доставка бесплатная</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Icon name="PackageCheck" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Разгрузка манипулятором</h4>
                    <p className="text-gray-600 text-sm">Доступна разгрузка материалов с помощью манипулятора</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop" 
                alt="Доставка"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-12">Калькулятор доставки</h2>
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <Label htmlFor="city">Город доставки</Label>
                  <Input id="city" name="city" placeholder="Введите город" required />
                </div>
                
                <div>
                  <Label htmlFor="weight">Вес груза (кг)</Label>
                  <Input id="weight" name="weight" type="number" placeholder="Введите вес" required />
                </div>
                
                <div>
                  <Label htmlFor="transport">Тип транспорта</Label>
                  <Select name="transport" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите транспорт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gazelle">Газель</SelectItem>
                      <SelectItem value="kamaz">Камаз</SelectItem>
                      <SelectItem value="manipulator">Манипулятор</SelectItem>
                      <SelectItem value="dump">Самосвал</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Рассчитать стоимость
                </Button>
                
                {calculatedPrice !== null && (
                  <div className="bg-orange-50 p-6 rounded-lg text-center animate-scale-in">
                    <p className="text-gray-600 mb-2">Примерная стоимость доставки:</p>
                    <p className="text-3xl font-bold text-primary">{calculatedPrice.toLocaleString()} ₽</p>
                    <div className="flex gap-3 mt-4 justify-center">
                      <Button onClick={() => { setRequestType('Заявка'); setRequestModalOpen(true); }}>
                        Зафиксировать цену
                      </Button>
                      <Button variant="outline" onClick={() => setCallbackModalOpen(true)}>
                        Обсудить детали
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contacts" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Контакты</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Phone" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Телефон</h3>
                <a href="tel:+79991234567" className="text-primary hover:underline">+7 (999) 123-45-67</a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="Mail" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:info@stroyimperiya.ru" className="text-primary hover:underline">info@stroyimperiya.ru</a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Icon name="MapPin" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Адрес</h3>
                <p className="text-gray-600">г. Москва, ул. Строителей, 123</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4"><span className="text-primary">НПТО</span> СтройИмперия</h3>
              <p className="text-gray-400 text-sm">Надежный поставщик строительных материалов с 2010 года</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <div className="space-y-2 text-sm">
                <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Главная</a>
                <a href="#catalog" className="block text-gray-400 hover:text-white transition-colors">Каталог</a>
                <a href="#promo" className="block text-gray-400 hover:text-white transition-colors">Акции</a>
                <a href="#advantages" className="block text-gray-400 hover:text-white transition-colors">Преимущества</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>+7 (999) 123-45-67</p>
                <p>info@stroyimperiya.ru</p>
                <p>г. Москва, ул. Строителей, 123</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Социальные сети</h4>
              <div className="flex gap-3">
                <a href="https://t.me/yourcompany" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-primary rounded-full transition-colors">
                  <Icon name="Send" size={20} />
                </a>
                <a href="https://vk.com/yourcompany" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-primary rounded-full transition-colors">
                  <Icon name="Share2" size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 НПТО СтройИмперия. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-500 shadow-2xl z-40 lg:hidden">
        <div className="container mx-auto px-2 py-3 flex justify-around items-center">
          <a href="tel:+79991234567" className="flex flex-col items-center text-xs hover:bg-orange-50 p-2 rounded-lg transition-colors active:scale-95">
            <div className="bg-orange-100 p-2 rounded-full mb-1">
              <Icon name="Phone" size={20} className="text-primary" />
            </div>
            <span className="font-medium">Позвонить</span>
          </a>
          <button onClick={() => setCallbackModalOpen(true)} className="flex flex-col items-center text-xs hover:bg-orange-50 p-2 rounded-lg transition-colors active:scale-95">
            <div className="bg-orange-100 p-2 rounded-full mb-1">
              <Icon name="PhoneCall" size={20} className="text-primary" />
            </div>
            <span className="font-medium">Звонок</span>
          </button>
          <button onClick={() => { setRequestType('Заявка'); setRequestModalOpen(true); }} className="flex flex-col items-center text-xs hover:bg-orange-50 p-2 rounded-lg transition-colors active:scale-95">
            <div className="bg-primary p-2 rounded-full mb-1 shadow-md">
              <Icon name="FileText" size={20} className="text-white" />
            </div>
            <span className="font-medium text-primary">Заявка</span>
          </button>
        </div>
      </div>

      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оставить заявку</DialogTitle>
            <DialogDescription>
              Заполните форму и наш менеджер свяжется с вами в течение 15 минут
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше имя *</Label>
              <Input id="name" name="name" placeholder="Иван Иванов" required />
            </div>
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="example@mail.ru" />
            </div>
            <div>
              <Label htmlFor="message">Сообщение</Label>
              <Textarea id="message" name="message" placeholder="Опишите интересующие вас материалы или задайте вопрос" rows={4} />
            </div>
            <Button type="submit" className="w-full">Отправить заявку</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={callbackModalOpen} onOpenChange={setCallbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Заказать обратный звонок</DialogTitle>
            <DialogDescription>
              Мы перезвоним вам в удобное время
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCallbackSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cb-name">Ваше имя *</Label>
              <Input id="cb-name" name="cb-name" placeholder="Иван Иванов" required />
            </div>
            <div>
              <Label htmlFor="cb-phone">Телефон *</Label>
              <Input id="cb-phone" name="cb-phone" type="tel" placeholder="+7 (999) 123-45-67" required />
            </div>
            <div>
              <Label htmlFor="cb-time">Удобное время для звонка</Label>
              <Select name="cb-time">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="В течение часа">В течение часа</SelectItem>
                  <SelectItem value="С 9:00 до 12:00">С 9:00 до 12:00</SelectItem>
                  <SelectItem value="С 12:00 до 15:00">С 12:00 до 15:00</SelectItem>
                  <SelectItem value="С 15:00 до 18:00">С 15:00 до 18:00</SelectItem>
                  <SelectItem value="Уточнить по телефону">Уточнить по телефону</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Заказать звонок</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;