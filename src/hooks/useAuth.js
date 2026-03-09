import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearAuthState,
    setExibirToastLoginState,
    setMensagemToastLoginState,
    setNomeUsuarioHeaderState,
    setPrimeiraInicialHeaderState,
    setSegundaInicialHeaderState,
    setTipoMensagemLoginState,
    setTokenState,
} from "../store/authSlice";

function writeStorage(key, value) {
    if (value === null || value === undefined) {
        localStorage.removeItem(key);
        return;
    }
    localStorage.setItem(key, value);
}

function useAuth() {
    const dispatch = useDispatch();
    const {
        token,
        nomeUsuarioHeader,
        primeiraInicialHeader,
        segundaInicialHeader,
        exibirToastLogin,
        tipoMesagemLogin,
        mensagemToastLogin,
    } = useSelector((state) => state.auth);

    const setToken = useCallback(
        (value) => {
            dispatch(setTokenState(value));
            writeStorage("Token", value);
        },
        [dispatch]
    );

    const setNomeUsuarioHeader = useCallback(
        (value) => {
            dispatch(setNomeUsuarioHeaderState(value));
            writeStorage("nomeUsuarioHeader", value);
        },
        [dispatch]
    );

    const setPrimeiraInicialHeader = useCallback(
        (value) => {
            dispatch(setPrimeiraInicialHeaderState(value));
            writeStorage("primeiraInicialHeader", value);
        },
        [dispatch]
    );

    const setSegundaInicialHeader = useCallback(
        (value) => {
            dispatch(setSegundaInicialHeaderState(value));
            writeStorage("segundaInicialHeader", value);
        },
        [dispatch]
    );

    const setExibirToastLogin = useCallback(
        (value) => {
            dispatch(setExibirToastLoginState(value));
        },
        [dispatch]
    );

    const setTipoMensagemLogin = useCallback(
        (value) => {
            dispatch(setTipoMensagemLoginState(value));
        },
        [dispatch]
    );

    const setMensagemToastLogin = useCallback(
        (value) => {
            dispatch(setMensagemToastLoginState(value));
        },
        [dispatch]
    );

    const signIn = useCallback(
        async (email, senha, callback) => {
            try {
                const body = { email, senha };

                const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setExibirToastLogin(true);
                    setTipoMensagemLogin("erro");
                    setMensagemToastLogin(data);
                    return;
                }

                const primeiroNome = data.usuario.nome_usuario.split(" ")[0];
                const primeiraInicial = primeiroNome[0];
                const segundaInicial =
                    data.usuario.nome_usuario.split(" ").length >= 2
                        ? data.usuario.nome_usuario.split(" ")[1][0]
                        : "";

                setNomeUsuarioHeader(primeiroNome);
                setPrimeiraInicialHeader(primeiraInicial);
                setSegundaInicialHeader(segundaInicial);
                setToken(data.token);
                callback();
            } catch (error) {
                setExibirToastLogin(true);
                setTipoMensagemLogin("erro");
                setMensagemToastLogin(error.message);
            }
        },
        [
            setExibirToastLogin,
            setMensagemToastLogin,
            setNomeUsuarioHeader,
            setPrimeiraInicialHeader,
            setSegundaInicialHeader,
            setTipoMensagemLogin,
            setToken,
        ]
    );

    const logout = useCallback(
        (callback) => {
            dispatch(clearAuthState());
            writeStorage("Token", null);
            writeStorage("nomeUsuarioHeader", null);
            writeStorage("primeiraInicialHeader", null);
            writeStorage("segundaInicialHeader", null);
            callback();
        },
        [dispatch]
    );

    return {
        token,
        setToken,
        signIn,
        logout,
        nomeUsuarioHeader,
        setNomeUsuarioHeader,
        primeiraInicialHeader,
        setPrimeiraInicialHeader,
        segundaInicialHeader,
        setSegundaInicialHeader,
        exibirToastLogin,
        setExibirToastLogin,
        tipoMesagemLogin,
        setTipoMensagemLogin,
        mensagemToastLogin,
        setMensagemToastLogin,
    };
}

export default useAuth;