# Note sur les Context dans React

Les composants imbriqués dans un Context Provider ne seront re-rendus que si deux conditions sont remplies :

- Ils accèdent au contexte via `useContext()` ou `Context.Consumer` : Le composant doit explicitement s'abonner aux valeurs du contexte en appelant `useContext`ou en utilisant un `Consumer`. **Si un composant n'appelle pas `useContext` pour accéder aux valeurs du contexte, il ne sera pas re-rendu en réponse à des changements dans ce contexte**.

- Les valeurs fournies par le `Context.Provider` changent : Si la valeur fournie dans la prop `value` du `Context.Provider` change, **seuls les composants abonnés** (ceux qui utilisent `useContext`) **seront re-rendus** pour refléter ces changements.

Cela signifie que si un composant est imbriqué dans un `Context.Provider` mais n'utilise pas `useContext`, il ne sera pas affecté par les changements de contexte et ne sera pas re-rendu. Cela permet d'éviter des re-rendus inutiles et d'optimiser les performances.

Si tu veux surveiller ou optimiser les re-rendus, tu peux utiliser des outils comme `React.memo` pour éviter des re-rendus excessifs dans des composants qui dépendent du contexte.