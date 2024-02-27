// Fonction pour calculer le module en dB de H(p)
function calculateModuleInDB(av, fh, frequencies) {
  var moduleDataDB = [];
  var p;
  for (var i = 0; i < frequencies.length; i++) {
    p = 2 * Math.PI * frequencies[i];
    moduleDataDB.push(20 * Math.log10(Math.abs((2 * Math.PI * av * fh) / (p + 2 * Math.PI * fh))));
  }
  return moduleDataDB;
}

// JavaScript pour mettre à jour le tracé
function updatePlot() {
  var av = parseFloat(document.getElementById('av').value);
  var fh_mhz = parseFloat(document.getElementById('fh').value); // Fréquence haute en MHz
  var fh = fh_mhz * 1e6; // Convertir MHz en Hz
  var fmin = parseFloat(document.getElementById('fmin').value); // Utiliser parseFloat pour obtenir un réel
  var fmax_mhz = parseFloat(document.getElementById('fmax').value); // fmax en MHz
  var fmax = fmax_mhz * 1e6; // Convertir MHz en Hz

  // Calculer les coordonnées du point de coupure
  var x_intersection = av * fh;
  var y_intersection = 0; // Pour couper l'axe des x, la valeur y est 0

  // Calculer la valeur y de la droite horizontale
  var horizontalLineY = 20 * Math.log10(av);

  // Créer les données pour le tracé
  var frequencies = [];
  var currentFrequency = fmin;
  while (currentFrequency <= fmax) {
    frequencies.push(currentFrequency);
    currentFrequency *= 2; // Augmente la fréquence par pas de 10 pour la visualisation
  }

  var moduleDataDB = calculateModuleInDB(av, fh, frequencies);

  var data = [
    {
      x: frequencies,
      y: moduleDataDB,
      type: 'scatter',
      mode: 'lines',
      name: '|H(p)| (dB) reel',
      line: {
        color: 'blue'
      }
    },
    {
      x: [fmin, fh, x_intersection],
      y: [horizontalLineY, horizontalLineY, y_intersection],
      type: 'scatter',
      mode: 'lines',
      name: '|H(p)| (dB) asympto.',
      line: {
        dash: 'dash',
        color: 'red'
      }
    }
  ];

  // Mettre à jour les données du tracé
  Plotly.newPlot('graph', data, {
    xaxis: {
      title: 'Frequency (Hz)',
      range: [Math.log10(fmin), Math.log10(fmax)], // Définir la plage de l'axe des x avec échelle log
      type: 'log' // Utiliser une échelle logarithmique pour l'axe des x
    },
    yaxis: {
      title: 'Magnitude (dB)'
    }
  });
}

// Fonction pour réinitialiser les champs
function resetFields() {
  document.getElementById('av').value = '';
  document.getElementById('fh').value = '';
  document.getElementById('fmin').value = '';
  document.getElementById('fmax').value = '';
  document.getElementById('results').innerText = ''; // Remplace innerHTML par innerText pour éviter une erreur si le résultat est null
}

// Attacher un gestionnaire d'événement au clic du bouton "PLOT"
document.addEventListener('DOMContentLoaded', function() {
  var plotButton = document.getElementById('plotButton');
  plotButton.addEventListener('click', updatePlot);

  var resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', resetFields);
});
