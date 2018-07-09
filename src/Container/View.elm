module Container.View exposing (view)

import Container.Types exposing (..)
import History.Types
import History.View
import Html exposing (..)
import Html.Styled
import Player.Types
import Player.View
import Wallpaper.View
import Html.Styled.Attributes exposing (css)
import Css exposing (..)


view : Model -> Html Msg
view model =
    div []
        [ content model
            |> Html.Styled.toUnstyled
        , Wallpaper.View.view model.wallpaper
            |> Html.Styled.map PlayerMsg
            |> Html.Styled.toUnstyled
        ]


content model =
    Html.Styled.div [ style ]
        [ Html.Styled.div [ gridStyle ]
            [ Player.View.view model.player
                |> Html.Styled.map PlayerMsg
            , History.View.view model.history
                |> Html.Styled.map HistoryMsg
            ]
        ]


gridStyle =
    css
        [ property "display" "grid"
        , property "grid-template-columns" "36px auto"
        , property "grid-column-gap" "10px"
        , property "justify-items" "center"
        , property "align-items" "center"
        ]


style =
    css
        [ property "display" "flex"
        , position absolute
        , width (pct 100)
        , height (pct 100)
        , top (px 0)
        , left (px 0)
        , justifyContent center
        , alignItems center
        , backgroundColor (rgba 0 0 0 0.4)
        , zIndex (int 1)
        ]
