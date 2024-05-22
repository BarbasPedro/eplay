import ProductsList from '../../components/ProductsList'

import {
  useGetActionGamesQuery,
  useGetFightGamesQuery,
  useGetRpgGamesQuery,
  useGetSimulationGamesQuery,
  useGetSportGamesQuery
} from '../../services/api'

const Categories = () => {
  const { data: actionGames, isLoading: isLoadingActionGames } =
    useGetActionGamesQuery()
  const { data: fightGames, isLoading: isLoadingFightGames } =
    useGetFightGamesQuery()
  const { data: rpgGames, isLoading: isLoadingRpgGames } = useGetRpgGamesQuery()
  const { data: simulationGames, isLoading: isLoadingSimulationGames } =
    useGetSimulationGamesQuery()
  const { data: sportGames, isLoading: isLoadingSportGames } =
    useGetSportGamesQuery()

  return (
    <>
      <ProductsList
        games={actionGames}
        title="Ação"
        background="black"
        id="action"
        isLoading={isLoadingActionGames}
      />
      <ProductsList
        games={sportGames}
        title="Esportes"
        background="gray"
        id="sports"
        isLoading={isLoadingSportGames}
      />
      <ProductsList
        games={fightGames}
        title="Luta"
        background="black"
        id="fight"
        isLoading={isLoadingFightGames}
      />
      <ProductsList
        games={rpgGames}
        title="RPG"
        background="gray"
        id="rpg"
        isLoading={isLoadingRpgGames}
      />
      <ProductsList
        games={simulationGames}
        title="Simulação"
        background="black"
        id="simulation"
        isLoading={isLoadingSimulationGames}
      />
    </>
  )
}

export default Categories
