import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useFormik } from 'formik'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'

import Button from '../../components/Button'
import Card from '../../components/Card'

import { usePurchaseMutation } from '../../services/api'
import { RootReducer } from '../../store'

import creditCard from '../../assets/images/cartao.svg'
import barCode from '../../assets/images/boleto.svg'

import { InputGroup, Row, TabButton } from './styles'
import { getTotalPrice, parseToBRL } from '../../utils'
import { clear } from '../../store/reducers/cart'

type Installment = {
  quantity: number
  amount: number
  formattedAmount: string
}

const Checkout = () => {
  const [payWithCard, setPayWithCard] = useState(false)
  const [purchase, { data, isSuccess, isLoading }] = usePurchaseMutation()
  const { items } = useSelector((state: RootReducer) => state.cart)
  const [installments, setInstallments] = useState<Installment[]>([])
  const dispatch = useDispatch()

  const totalPrice = getTotalPrice(items)

  const form = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      cpf: '',
      deliveryEmail: '',
      confirmDeliveryEmail: '',
      cardOwner: '',
      cpfCardOwner: '',
      cardDisplayName: '',
      cardNumber: '',
      expiresMonth: '',
      expiresYear: '',
      cardCode: '',
      installments: 1
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(5, 'O nome precisa ter pelo menos 5 caracteres')
        .required('O campo é obrigatório'),
      email: Yup.string()
        .min(14, 'O campo precisa ter 14 caractéres')
        .max(14, 'O campo precisa ter 14 caractéres')
        .required('O campo é obrigatório'),
      cpf: Yup.string()
        .email('E-mail inválido')
        .required('O campo é obrigatório'),
      deliveryEmail: Yup.string()
        .email('E-mail inválido')
        .required('O campo é obrigatório'),
      confirmDeliveryEmail: Yup.string()
        .oneOf([Yup.ref('deliveryEmail')], 'Os e-mails são diferentes')
        .required('O campo é obrigatório'),

      cardOwner: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      cpfCardOwner: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      cardDisplayName: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      cardNumber: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      expiresMonth: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      expiresYear: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      cardCode: Yup.string().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      ),
      installments: Yup.number().when((values, schema) =>
        payWithCard ? schema.required('O campo é obrigatório') : schema
      )
    }),
    onSubmit: (values) => {
      console.log(values)
      purchase({
        billing: {
          document: values.cpf,
          email: values.email,
          name: values.fullName
        },
        delivery: {
          email: values.deliveryEmail
        },
        payment: {
          installments: values.installments,
          card: {
            active: payWithCard,
            code: Number(values.cardCode),
            name: values.cardOwner,
            number: values.cardNumber,
            owner: {
              document: values.cpfCardOwner,
              name: values.cardOwner
            },
            expires: {
              month: Number(values.expiresMonth),
              year: Number(values.expiresYear)
            }
          }
        },
        products: items.map((item) => ({
          id: item.id,
          price: item.prices.current as number
        }))
      })
    }
  })

  const checkInput = (fieldName: string) => {
    const isTouched = fieldName in form.touched
    const isInvalid = fieldName in form.errors
    const hasError = isTouched && isInvalid

    return hasError
  }

  useEffect(() => {
    const calculatedInstallments = () => {
      const installmentsArray: Installment[] = []

      for (let i = 1; i <= 6; i++) {
        installmentsArray.push({
          quantity: i,
          amount: totalPrice / i,
          formattedAmount: parseToBRL(totalPrice / i)
        })
      }
      return installmentsArray
    }

    if (totalPrice > 0) {
      setInstallments(calculatedInstallments())
    }
  }, [totalPrice])

  useEffect(() => {
    if (isSuccess) {
      dispatch(clear())
    }
  }, [isSuccess, dispatch])

  if (items.length === 0 && !isSuccess) {
    return <Navigate to="/" />
  } else {
    return (
      <div className="container">
        {isSuccess && data ? (
          <Card title="Muito obrigado!">
            <>
              <p>
                É com satisfação que informamos que recebemos seu pedido com
                sucesso! <br />
                Abaixo estão os detalhes da sua compra: <br />
                Número do pedido: {data.orderId} <br />
                Forma de pagamento:{' '}
                {payWithCard ? 'Cartão de Crédito' : 'Boleto Bancário'}
              </p>
              <p className="margin-top">
                Caso tenha optado pelo pagamento via boleto bancário, lembre-se
                de que a confirmação pode levar até 3 dias úteis. Após a
                aprovação do pagamento, enviaremos um e-mail contendo o código
                de ativação do jogo.
              </p>
              <p className="margin-top">
                Se você optou pelo pagamento com cartão de crédito, a liberação
                do código de ativação ocorrerá após a aprovação da transação
                pela operadora do cartão. Você receberá o código no e-mail
                cadastrado em nossa loja.
              </p>
              <p className="margin-top">
                Pedimos que verifique sua caixa de entrada e a pasta de spam
                para garantir que receba nossa comunicação. Caso tenha alguma
                dúvida ou necessite de mais informações, por favor, entre em
                contato conosco através dos nossos canais de atendimento ao
                cliente.
              </p>
              <p className="margin-top">
                Agradecemos por escolher a EPLAY e esperamos que desfrute do seu
                jogo!
              </p>
            </>
          </Card>
        ) : (
          <form onSubmit={form.handleSubmit}>
            <Card title="Dados de Cobrança">
              <>
                <Row>
                  <InputGroup>
                    <label htmlFor="fullName">Nome Completo</label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={form.values.fullName}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      className={checkInput('fullName') ? 'error' : ''}
                    />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="email">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.values.email}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      className={checkInput('email') ? 'error' : ''}
                    />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="cpf">CPF</label>
                    <InputMask
                      id="cpf"
                      type="text"
                      name="cpf"
                      value={form.values.cpf}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      className={checkInput('cpf') ? 'error' : ''}
                      mask="999.999.999-99"
                    />
                  </InputGroup>
                </Row>
                <h3 className="margin-top">
                  Dados de entrega - conteúdo digital
                </h3>
                <Row>
                  <InputGroup>
                    <label htmlFor="deliveryEmail">Email</label>
                    <input
                      id="deliveryEmail"
                      type="email"
                      name="deliveryEmail"
                      value={form.values.deliveryEmail}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      className={checkInput('deliveryEmail') ? 'error' : ''}
                    />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="confirmDeliveryEmail">
                      Confirme o E-mail
                    </label>
                    <input
                      id="confirmDeliveryEmail"
                      type="email"
                      name="confirmDeliveryEmail"
                      value={form.values.confirmDeliveryEmail}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      className={
                        checkInput('confirmDeliveryEmail') ? 'error' : ''
                      }
                    />
                  </InputGroup>
                </Row>
              </>
            </Card>
            <Card title="Pagamento">
              <>
                <TabButton
                  isActive={!payWithCard}
                  onClick={() => setPayWithCard(false)}
                  type="button"
                >
                  <img src={barCode} alt="Boleto" />
                  Boleto Bancário
                </TabButton>
                <TabButton
                  isActive={payWithCard}
                  onClick={() => setPayWithCard(true)}
                  type="button"
                >
                  <img src={creditCard} alt="Cartão de Crédito" />
                  Cartão de Crédito
                </TabButton>
                {payWithCard ? (
                  <>
                    <Row>
                      <InputGroup>
                        <label htmlFor="cardOwner">
                          Nome do titular do cartão
                        </label>
                        <input
                          id="cardOwner"
                          type="text"
                          name="cardOwner"
                          value={form.values.cardOwner}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('cardOwner') ? 'error' : ''}
                        />
                      </InputGroup>
                      <InputGroup>
                        <label htmlFor="cpfCardOwner">
                          CPF do titular do cartão
                        </label>
                        <InputMask
                          id="cpfCardOwner"
                          type="text"
                          name="cpfCardOwner"
                          value={form.values.cpfCardOwner}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('cpfCardOwner') ? 'error' : ''}
                          mask="999.999.999-99"
                        />
                      </InputGroup>
                    </Row>
                    <Row marginTop="24px">
                      <InputGroup>
                        <label htmlFor="cardDisplayName">Nome no cartão</label>
                        <input
                          id="cardDisplayName"
                          type="text"
                          name="cardDisplayName"
                          value={form.values.cardDisplayName}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={
                            checkInput('cardDisplayName') ? 'error' : ''
                          }
                        />
                      </InputGroup>
                      <InputGroup>
                        <label htmlFor="cardNumber">Número do cartão</label>
                        <InputMask
                          id="cardNumber"
                          type="text"
                          name="cardNumber"
                          value={form.values.cardNumber}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('cardNumber') ? 'error' : ''}
                          mask="9999 9999 9999 9999"
                        />
                      </InputGroup>
                      <InputGroup maxWidth="123px">
                        <label htmlFor="expiresMonth">Mês de expiração</label>
                        <InputMask
                          id="expiresMonth"
                          type="text"
                          name="expiresMonth"
                          value={form.values.expiresMonth}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('expiresMonth') ? 'error' : ''}
                          mask="99"
                        />
                      </InputGroup>
                      <InputGroup maxWidth="123px">
                        <label htmlFor="expiresYear">Ano de expiração</label>
                        <InputMask
                          id="expiresYear"
                          type="text"
                          name="expiresYear"
                          value={form.values.expiresYear}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('expiresYear') ? 'error' : ''}
                          mask="99"
                        />
                      </InputGroup>
                      <InputGroup maxWidth="123px">
                        <label htmlFor="cardCode">CVV</label>
                        <InputMask
                          id="cardCode"
                          type="text"
                          name="cardCode"
                          value={form.values.cardCode}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('cardCode') ? 'error' : ''}
                          mask="999"
                        />
                      </InputGroup>
                    </Row>
                    <Row marginTop="24px">
                      <InputGroup maxWidth="150px">
                        <label htmlFor="installments">Parcelamento</label>
                        <select
                          id="installments"
                          name="installments"
                          value={form.values.installments}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          className={checkInput('installments') ? 'error' : ''}
                        >
                          {installments.map((installments) => (
                            <option
                              value={installments.quantity}
                              key={installments.quantity}
                            >
                              {installments.quantity}x de{' '}
                              {installments.formattedAmount}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                    </Row>
                  </>
                ) : (
                  <p>
                    Ao optar por essa forma de pagamento, é importante lembrar
                    que a confirmação pode levar até 3 dias úteis, devido aos
                    prazos estabelecidos pelas instituições financeiras.
                    Portanto, a liberação do código de ativação do jogo
                    adquirido ocorrerá somente após a aprovação do pagamento do
                    boleto.
                  </p>
                )}
              </>
            </Card>
            <Button
              title="Clique aqui para finalizar a compra"
              type="submit"
              onClick={form.handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Finalizando compra...' : 'Finalizar Compra'}
            </Button>
          </form>
        )}
      </div>
    )
  }
}
export default Checkout
