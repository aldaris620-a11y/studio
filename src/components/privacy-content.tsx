
export default function PrivacyContent() {
  const policies = [
    {
        title: "¿Qué datos guardamos?",
        description: "Tu correo, tu nombre de usuario y qué tan bueno (o malo) eres en los juegos. Básicamente, lo esencial para que puedas presumir de tus logros."
    },
    {
        title: "¿Vendemos tus datos a aliens o corporaciones malvadas?",
        description: "No. A menos que nos ofrezcan una nave espacial o la cura para el lag. Es broma... a medias. Tus datos están a salvo con nosotros."
    },
    {
        title: "¿Usamos cookies?",
        description: "Sí, pero solo las del tipo digital, no las de chocolate. Sirven para que no tengas que iniciar sesión cada 5 minutos."
    },
    {
        title: "¿Puedes borrar tu cuenta?",
        description: "Claro, pero todos tus récords se irán contigo al vacío digital. Será como si nunca hubieras existido. Sin presiones."
    },
    {
        title: "¿Cómo protegemos tus valiosos datos?",
        description: "Con un firewall más potente que el escudo de un jefe final y encriptación que ni los mejores hackers podrían descifrar (probablemente)."
    },
    {
        title: "¿Compartimos tus datos con tus amigos... o enemigos?",
        description: "Solo tu nombre de usuario y tus logros son públicos. No le diremos a nadie cuántas veces fallaste esa misión de sigilo."
    },
    {
        title: "¿Qué pasa si eres menor de edad?",
        description: "Si eres un 'youngling', necesitas el permiso de tus padres (los admins de tu vida real) para unirte a nuestra comunidad. No queremos que nos castiguen."
    },
    {
        title: "Publicidad: ¿Te spamearemos como un jefe final?",
        description: "Podríamos mostrarte anuncios relevantes sobre nuevos juegos o periféricos geniales. No te preocupes, no serán tan molestos como un PNJ que no para de hablar."
    },
    {
        title: "¿Cambios en esta política?",
        description: "Si cambiamos algo, te lo notificaremos como una actualización de parche. Probablemente nerfearemos algunas cláusulas y buffearemos otras."
    },
    {
        title: "¿Tienes alguna pregunta, aventurero?",
        description: "Si tienes dudas, puedes enviarnos un mensaje. Nuestro equipo de soporte (un hechicero nivel 20) te responderá... eventualmente."
    }
  ];

  return (
     <div className="space-y-6">
          {policies.map((policy, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg">{index + 1}. {policy.title}</h3>
              <p className="text-muted-foreground text-sm">{policy.description}</p>
            </div>
          ))}
    </div>
  );
}
