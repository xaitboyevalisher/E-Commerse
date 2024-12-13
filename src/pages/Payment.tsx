import { Checkbox } from "antd";

const DeliveryPaymentReturn = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Доставка</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <img
              src="/1.png"
              alt="Почта России"
              className="mb-4 w-full h-auto"
            />
            <h3 className="text-lg font-semibold mb-2">Почта России</h3>
            <ul className="list-none space-y-1 text-gray-700">
              <li>
                <Checkbox>
                  Получение посылки согласно условиям перевозчика
                </Checkbox>
              </li>
              <li>
                <Checkbox>Доставка в течение 1-2 дней</Checkbox>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <img
              src="/1 (1).png"
              alt="Деловые линии"
              className="mb-4 w-full h-auto"
            />
            <h3 className="text-lg font-semibold mb-2">Деловые линии</h3>
            <ul className="list-none space-y-1 text-gray-700">
              <li>
                <Checkbox>
                  Получение посылки согласно условиям перевозчика
                </Checkbox>
              </li>
              <li>
                <Checkbox>Доставка в течение 1-2 дней</Checkbox>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <img src="/1 (2).png" alt="СДЭК" className="mb-4 w-full h-auto" />
            <h3 className="text-lg font-semibold mb-2">СДЭК</h3>
            <ul className="list-none space-y-1 text-gray-700">
              <li>
                <Checkbox>
                  Получение посылки согласно условиям перевозчика
                </Checkbox>
              </li>
              <li>
                <Checkbox>Доставка в течение 1-2 дней</Checkbox>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Оплата</h2>
        <div className="mb-6">
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <img
              src="/credit-card (1) 1.png"
              alt="Банковская карта"
              className="w-6 h-6 mr-2"
            />
            Банковская карта
          </h3>
          <p className="text-gray-700 ml-8">
            Онлайн заказ можно оплатить с помощью банковской карты, выпущенной
            на территории России. Оформляя заказ на сайте, в пункте «Оплата»
            выберите «Банковская карта». После передачи заявки на страницу
            системы безопасных платежей, необходимо лишь подтвердить платеж.
          </p>
        </div>
        <div>
          <h3 className="flex items-center text-lg font-semibold mb-2">
            <img
              src="/Frame.png"
              alt="Оплата при получении"
              className="w-6 h-6 mr-2"
            />
            Оплата при получении товара
          </h3>
          <p className="text-gray-700 ml-8">
            Онлайн заказ можно оплатить непосредственно при получении. Оформляя
            заказ на сайте, в пункте «Оплата» выберите «Оплата при получении
            товара». После того как товар будет доставлен на указанный адрес,
            осмотрите, оплатите стоимость товара удобным для вас способом.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Гарантии</h2>
        <p className="text-gray-700">
          На все товары, приобретенные в нашем магазине, предоставляется
          гарантия в соответствии с законодательством Российской Федерации.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-700">
          <li>Гарантийный ремонт в течение указанного срока.</li>
          <li>
            Обращение в сервисный центр для уточнения условий гарантии и решения
            проблем.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Возврат товара</h2>
        <p className="text-gray-700 mb-4">
          Подготовьте, пожалуйста, все необходимые документы:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            выданный продавцом расчетный документ (чек / акт приема-передачи /
            накладная или др.), подтверждающий факт приобретения;
          </li>
          <li>гарантийный талон;</li>
          <li>документ, удостоверяющий личность;</li>
          <li>идентификационный налоговый номер (ИНН);</li>
          <li>
            в случае оплаты покупки банковской картой — актуальные реквизиты
            карточного счета.
          </li>
        </ul>
        <p className="text-gray-700 mb-4">
          Передайте товар на гарантийное обслуживание, обязательно приложите
          указанные выше документы.
        </p>
        <p className="text-gray-700">
          Полезная информация о правах потребителя в случае приобретения им
          товара ненадлежащего качества —{" "}
          <a href="#" className="text-blue-600 underline">
            Закон РФ «О защите прав потребителей»
          </a>
          .
        </p>
        <p className="text-gray-700">
          Уважаемый покупатель, приносим извинения за неудобства, случившиеся в
          связи с выходом из строя. По вашему обращению будут приняты все меры
          для быстрого решения вашей проблемы.
        </p>
      </section>
    </div>
  );
};

export default DeliveryPaymentReturn;
